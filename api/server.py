from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Activity Data
activity_data = {
    "date": datetime.now().strftime("%B %d, %Y"),
    "restBPM": 65,
    "avgBPM": 135,
    "maxBPM": 178,
    "workoutType": "HIIT",
    "caloriesBurnt": 420,
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

# Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "Balex Fitness API is running",
        "timestamp": datetime.now().isoformat()
    }), 200

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