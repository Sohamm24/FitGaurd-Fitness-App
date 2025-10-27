# 1. Import libraries
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib
import matplotlib.pyplot as plt


# ---------------------------------------------------------
# 2. Load your processed dataset
# ---------------------------------------------------------
df = pd.read_csv('gym_members_exercise_tracking_synthetic_data.csv')
print(f"Dataset loaded: {df.shape}")


# ---------------------------------------------------------
# 3. Clean column names (remove spaces, tabs, newlines)
# ---------------------------------------------------------
df.columns = df.columns.str.replace(r'[\n\t\s]+', '', regex=True)


# ---------------------------------------------------------
# 4. Select numeric columns (exclude text or IDs)
# ---------------------------------------------------------
feature_cols = df.select_dtypes(include=[np.number]).columns
X = df[feature_cols]


# ---------------------------------------------------------
# 5. Handle missing values
# ---------------------------------------------------------
# Replace NaN or infinite values using median imputation
X = X.replace([np.inf, -np.inf], np.nan)
X = X.fillna(X.median())


# ---------------------------------------------------------
# 6. Standardize features (fit scaler on training data)
# ---------------------------------------------------------
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)


# ---------------------------------------------------------
# 7. Train Isolation Forest model
# ---------------------------------------------------------
iso_forest = IsolationForest(
    n_estimators=200,        # number of trees
    contamination=0.05,      # anomaly proportion estimate
    max_samples='auto',
    random_state=42
)
iso_forest.fit(X_scaled)


# ---------------------------------------------------------
# 8. Generate anomaly predictions & scores
# ---------------------------------------------------------
df['AnomalyScore'] = iso_forest.decision_function(X_scaled)
df['AnomalyFlag'] = iso_forest.predict(X_scaled)  # -1 = anomaly, 1 = normal


# Display basic anomaly statistics
num_anomalies = (df['AnomalyFlag'] == -1).sum()
print(f"Isolation Forest training complete. {num_anomalies} anomalies found out of {len(df)} samples.")


# ---------------------------------------------------------
# 9. Save all artifacts (for Flask API or production use)
# ---------------------------------------------------------
joblib.dump(scaler, 'workout_scaler.joblib')
joblib.dump(iso_forest, 'workout_isoforest.joblib')


# Save the exact feature order
feature_names = list(feature_cols)
joblib.dump(feature_names, 'feature_order.joblib')
print("Feature order saved successfully as 'feature_order.joblib'.")


# ---------------------------------------------------------
# 10. Define anomaly explanation method
# ---------------------------------------------------------
def explain_anomaly(instance, X_train, feature_names, scaler):
    """
    Explains which features made the instance anomalous
    by measuring deviation from the median of standardized training data.
    """
    # Scale input and training set
    instance_scaled = scaler.transform(pd.DataFrame([instance], columns=feature_names))
    X_scaled = scaler.transform(X_train)

    # Compute median of training data features
    medians = np.median(X_scaled, axis=0)

    # Absolute deviation of the instance from training median
    deviations = np.abs(instance_scaled[0] - medians)

    # Rank deviations
    contribution = pd.Series(deviations, index=feature_names).sort_values(ascending=False)

    # Return top 5 features responsible for anomaly
    top_contributors = contribution.head(5)
    print("\nTop contributing features for anomaly:")
    print(top_contributors)
    return top_contributors


# ---------------------------------------------------------
# 11. Example: Use the explainer on one detected anomaly
# ---------------------------------------------------------
# Pick one sample flagged as anomaly (-1)
anomaly_indices = df[df['AnomalyFlag'] == -1].index

if len(anomaly_indices) > 0:
    example_index = anomaly_indices[0]
    example_instance = X.iloc[example_index].to_dict()
    explain_anomaly(example_instance, X, feature_names, scaler)
else:
    print("No anomalies found in this dataset.")

# ---------------------------------------------------------
# 12. (Optional) Visualize score distribution
# ---------------------------------------------------------
plt.figure(figsize=(8, 5))
plt.hist(df['AnomalyScore'], bins=50, color='skyblue', edgecolor='black')
plt.title("Anomaly Score Distribution\n(higher = more normal)")
plt.xlabel("Score")
plt.ylabel("Frequency")
plt.show()
