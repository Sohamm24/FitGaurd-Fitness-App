from flask import Flask, jsonify, request
import joblib
import numpy as np
import pandas as pd
from flask_cors import CORS
import os
from datetime import datetime
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

scaler = joblib.load(os.path.join(os.path.dirname(__file__), "workout_scaler.joblib"))
feature_order = joblib.load(os.path.join(os.path.dirname(__file__), "feature_order.joblib"))
iso_forest = joblib.load(os.path.join(os.path.dirname(__file__), "workout_isoforest.joblib"))

# Activity Data
activity_data = {
    "date": datetime.now().strftime("%B %d, %Y"),
    "restBPM": 65,
    "avgBPM": 135,
    "maxBPM": 178,
    "workoutType": "HIIT",
    "caloriesBurnt": 421,
    "anomalies": [
        "Calorie burnt exceeded for your body physique aspect"
    ],
    "recommendedForms": [
        {
            "form": "Push-ups",
            "caloriesPer3Sets": 45,
            "targetMuscle": "Chest, Triceps",
            "difficulty": "Easy"
        },
        {
            "form": "Burpees",
            "caloriesPer3Sets": 85,
            "targetMuscle": "Full Body",
            "difficulty": "Hard"
        },
        {
            "form": "Mountain Climbers",
            "caloriesPer3Sets": 60,
            "targetMuscle": "Core, Cardio",
            "difficulty": "Medium"
        },
        {
            "form": "Squats",
            "caloriesPer3Sets": 50,
            "targetMuscle": "Legs, Glutes",
            "difficulty": "Easy"
        },
        {
            "form": "Plank Hold",
            "caloriesPer3Sets": 30,
            "targetMuscle": "Core",
            "difficulty": "Medium"
        },
        {
            "form": "Jump Squats",
            "caloriesPer3Sets": 75,
            "targetMuscle": "Legs, Cardio",
            "difficulty": "Hard"
        }
    ]
}

# Analytics Data
analytics_data = {
    "userCalories": 380,
    "avgCalories": 320,
    "userFrequency": 3,
    "userEfficiency": 75,
    "waterIntake": 1.5,
    "goodFactors": [
        "Your workout efficiency of 75% is above average, showing good form and technique",
        "Calorie burn of 380 per session exceeds community average by 18.75%",
        "Your heart rate zones indicate excellent cardiovascular engagement during workouts"
    ],
    "improvementFactors": [
        "Increase workout frequency to 4-5 days per week for optimal results",
        "Boost water intake to 2.5-3L daily to enhance recovery and performance",
        "Consider adding strength training to complement your HIIT routine",
        "Focus on post-workout nutrition within 30 minutes to maximize muscle recovery"
    ]
}

# Weekly Performance Data for Charts
weekly_performance = {
    "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    "userPerformance": [380, 420, 360, 400, 450, 390, 410],
    "communityAvg": [320, 310, 330, 315, 325, 320, 318]
}

# 30-Day Efficiency Data for Charts
efficiency_trend = {
    "labels": list(range(1, 31)),
    "efficiencyData": [65, 68, 70, 72, 75, 73, 76, 78, 75, 77, 80, 82, 79, 81, 83, 85, 82, 84, 86, 88, 85, 87, 89, 90, 88, 91, 92, 90, 93, 95]
}

SCALER_FILE = "workout_scaler.joblib"
MODEL_FILE = "workout_isoforest.joblib"

df1 = pd.read_csv('workout_exercises_dataset.csv')

# Define categorical and numeric columns
categorical_cols = ['form_name', 'target_muscle', 'equipment', 'intensity_level', 'experience_level', 'movement_type', 'exercise_type']
numeric_cols = ['avg_bpm', 'est_calories', 'popularity_score']

# Fit encoder and scaler on dataset
encoder2 = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
encoder2.fit(df1[categorical_cols])

scaler2 = StandardScaler()
scaler2.fit(df1[numeric_cols])



# Routes
@app.route('/api/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    user_muscles = data.get('top_muscles', [])
    user_experience = data.get('experience_level', '')
    user_bpm = data.get('avg_bpm', 130)

    recommendations = {}

    for muscle in user_muscles:
        musc_filter = df1['target_muscle'] == muscle
        exp_filter = df1['experience_level'] == user_experience
        subset = df1[musc_filter & exp_filter]

        if subset.empty:
            recommendations[muscle] = []
            continue

        sub_encoded_cat = encoder2.transform(subset[categorical_cols])
        sub_scaled_num = scaler2.transform(subset[numeric_cols])
        sub_features = np.hstack((sub_encoded_cat, sub_scaled_num))

        # Create user "profile" vector
        user_row = pd.DataFrame({
            'form_name': ['Standard'],
            'target_muscle': [muscle],
            'equipment': ['Bodyweight'],
            'intensity_level': ['Medium'],
            'experience_level': [user_experience],
            'movement_type': ['Push'],
            'exercise_type': ['Strength'],
            'avg_bpm': [user_bpm],
            'est_calories': [subset['est_calories'].mean()],
            'popularity_score': [subset['popularity_score'].mean()]
        })

        user_encoded_cat = encoder2.transform(user_row[categorical_cols])
        user_scaled_num = scaler2.transform(user_row[numeric_cols])
        user_features = np.hstack((user_encoded_cat, user_scaled_num))

        sims = cosine_similarity(user_features, sub_features)[0]
        top_idx = sims.argsort()[::-1][:3]

        top_exercises = []
        for idx in top_idx:
            row = subset.iloc[idx]
            top_exercises.append({
                'exercise_id': int(row['exercise_id']),
                'exercise_name': row['exercise_name'],
                'form_name': row['form_name'],
                'equipment': row['equipment'],
                'intensity_level': row['intensity_level'],
                'experience_level': row['experience_level'],
                'avg_bpm': float(row['avg_bpm']),
                'est_calories': float(row['est_calories']),
                'popularity_score': float(row['popularity_score']),
                'similarity_score': round(float(sims[idx]), 3)
            })

        recommendations[muscle] = top_exercises

    return jsonify(recommendations)


@app.route('/api/activities', methods=['GET'])
def get_activities():
    """Get today's activity data"""
    return jsonify(activity_data), 200

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """Get analytics data"""
    return jsonify(analytics_data), 200

@app.route('/api/analytics/weekly-performance', methods=['GET'])
def get_weekly_performance():
    """Get weekly performance chart data"""
    return jsonify(weekly_performance), 200

@app.route('/api/analytics/efficiency-trend', methods=['GET'])
def get_efficiency_trend():
    """Get 30-day efficiency trend data"""
    return jsonify(efficiency_trend), 200

def explain_anomaly(instance, X_baseline, feature_names, scaler):
    """
    Computes the top feature deviations that make this instance anomalous.
    Returns the top 5 features contributing most to the anomaly.
    """
    try:
        # Convert and scale
        instance_df = pd.DataFrame([instance], columns=feature_names)
        instance_scaled = scaler.transform(instance_df)
        baseline_scaled = scaler.transform(X_baseline)

        # Compute medians from baseline
        medians = np.median(baseline_scaled, axis=0)
        deviations = np.abs(instance_scaled[0] - medians)

        # Sort by deviation magnitude
        contributions = pd.Series(deviations, index=feature_names).sort_values(ascending=False)

        return contributions.head(5).to_dict()
    except Exception as e:
        return {"error": f"Explanation error: {str(e)}"}


# ------------------ API Endpoint ------------------
@app.route('/api/anomaly', methods=['POST'])
def predict():
    try:
        # 1. Parse incoming JSON input
        data = request.get_json(force=True)
        X = pd.DataFrame([data])

        # 2. Reindex to align with model training features
        X = X.reindex(columns=feature_order, fill_value=0)
        X = X.apply(pd.to_numeric, errors='coerce').replace([np.inf, -np.inf], 0).fillna(0)

        # 3. Scale features
        X_scaled = scaler.transform(X)

        # 4. Predict anomaly
        pred = iso_forest.predict(X_scaled)
        anomaly_score = iso_forest.decision_function(X_scaled)[0]
        is_anomaly = int(pred[0] == -1)

        # 5. Build response
        response = {
            "anomaly": is_anomaly,
            "message": "Anomalous" if is_anomaly else "Normal",
            "score": float(anomaly_score)
        }

        # 6. If anomalous, compute contributing factors
        if is_anomaly:
            # Use training sample medians as baseline context
            X_train_ref = pd.read_csv('gym_members_exercise_tracking_synthetic_data.csv')
            X_train_ref = X_train_ref.select_dtypes(include=[np.number]).fillna(0)
            top_contributors = explain_anomaly(data, X_train_ref, feature_order, scaler)
            response["contributing_factors"] = top_contributors

        return jsonify(response)

    except Exception as e:
        return jsonify({
            "error": str(e),
            "message": "Something went wrong during anomaly detection."
        }), 400


@app.route('/api/optimizeWorkout', methods=['POST'])
def optimize_workout():
    data = request.get_json()

    age = data.get("age")
    gender = data.get("gender")
    workout_type = data.get("workout_type")
    avg_bpm = data.get("avg_bpm")
    resting_bpm = data.get("resting_bpm")
    calories_burned = data.get("calories_burned")
    fat_percentage = data.get("fat_percentage")
    experience_level = data.get("experience_level")
    bmi = data.get("bmi")
    workout_frequency = data.get("workout_frequency")
    water_intake = data.get("water_intake")
    workout_efficiency = data.get("workout_efficiency")

    goodFactors = []
    improvementFactors = []

    # -------------------------------
    # RULE 1: Workout Efficiency
    # -------------------------------
    if workout_efficiency >= 70:
        goodFactors.append(
            f"Your workout efficiency of {workout_efficiency}% is above average, showing good form and technique"
        )
    else:
        improvementFactors.append(
            "Improve your workout form and consistency to increase overall efficiency above 70%"
        )

    # -------------------------------
    # RULE 2: Calories Burned
    # -------------------------------
    if calories_burned >= 350:
        goodFactors.append(
            f"Calorie burn of {calories_burned} per session exceeds community average"
        )
    else:
        improvementFactors.append(
            "Increase intensity or duration to raise calorie burn beyond 350 per session"
        )

    # -------------------------------
    # RULE 3: Heart Rate Zones
    # -------------------------------
    if 130 <= avg_bpm <= 170:
        goodFactors.append("Your heart rate zones indicate excellent cardiovascular engagement")
    else:
        improvementFactors.append("Maintain target heart rate zone (70–85% of max BPM) for better cardio results")

    # -------------------------------
    # RULE 4: Workout Frequency
    # -------------------------------
    if workout_frequency >= 4:
        goodFactors.append("Your workout consistency of 4+ days/week supports optimal progress")
    else:
        improvementFactors.append("Increase workout frequency to 4–5 days per week for optimal results")

    # -------------------------------
    # RULE 5: Water Intake
    # -------------------------------
    if water_intake >= 2.5:
        goodFactors.append("Adequate hydration supports recovery and performance")
    else:
        improvementFactors.append("Boost water intake to 2.5–3L daily to enhance recovery and performance")

    # -------------------------------
    # RULE 6: Experience Level
    # -------------------------------
    if experience_level.lower() in ["intermediate", "advanced"]:
        goodFactors.append("Experience level indicates good familiarity with workout routines")
    else:
        improvementFactors.append("Gradually increase difficulty to build experience and endurance")

    # -------------------------------
    # RULE 7: Workout Type
    # -------------------------------
    if workout_type.lower() == "hiit":
        improvementFactors.append("Consider adding strength training to complement your HIIT routine")
    elif workout_type.lower() == "cardio":
        improvementFactors.append("Mix in flexibility or strength sessions to balance your fitness profile")

    # -------------------------------
    # RULE 8: Post-Workout Recovery
    # -------------------------------
    improvementFactors.append("Focus on post-workout nutrition within 30 minutes to maximize muscle recovery")

    return jsonify({
        "goodFactors": goodFactors,
        "improvementFactors": improvementFactors
    })



@app.route('/api/profile', methods=['GET'])
def get_profile():
    """Get user profile (default values)"""
    return jsonify({
        "goal": "Build muscle and improve endurance",
        "sessionDuration": 45,
        "workoutFrequency": 4
    }), 200

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "error": "Not Found",
        "message": "The requested endpoint does not exist"
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "error": "Internal Server Error",
        "message": "Something went wrong on the server"
    }), 500

if __name__ == '__main__':
    print("\nServer running on http://localhost:5000")
    
    app.run(debug=True, port=5000)