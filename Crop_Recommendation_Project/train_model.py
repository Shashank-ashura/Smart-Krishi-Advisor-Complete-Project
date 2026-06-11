import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle

# Load the dataset
df = pd.read_csv('Crop_recommendation.csv')

# Split features and target
# Features: N, P, K, temperature, humidity, ph, rainfall
X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = df['label']

# Split data into training and testing
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train Random Forest
# Random Forest is chosen for its high accuracy (>99% on this dataset)
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save the trained model as a pickle file
with open('crop_model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("✅ Model training complete. File 'crop_model.pkl' created successfully.")