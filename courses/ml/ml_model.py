import pandas as pd
from sklearn.model_selection import cross_val_score
from sklearn.tree import DecisionTreeRegressor
from sklearn.svm import SVR
from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import StandardScaler
import joblib

def train_models():
    # Load the course data
    data = pd.read_csv("courses/ml/course_map.csv")

    # Convert ₹ and ⭐ to numeric
    data['Fees'] = data['Fees'].replace('[₹,]', '', regex=True).astype(float)
    data['Placement Rate'] = data['Placement Rate'].replace('%', '', regex=True).astype(float)
    data['Rating'] = data['Rating'].replace('⭐', '', regex=True).astype(float)

    # Ensure Duration is treated as a string before extracting the numeric part
    data['Duration'] = data['Duration'].astype(str).str.extract(r'(\d+)').astype(float)

    # Create a custom score as a weighted sum (higher is better)
    data['course_score'] = (
        data['Placement Rate'] * 0.4 +
        data['Rating'] * 0.3 +
        (1 / data['Fees']) * 10000 * 0.2 +  # Lower fees = better
        (1 / data['Duration']) * 10 * 0.1   # Shorter duration = slightly better
    )

    # Define features and target
    features = ['Fees', 'Placement Rate', 'Rating', 'Duration']
    X = data[features]
    y = data['course_score']

    # Scale the features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Initialize models
    models = {
        'DecisionTree': DecisionTreeRegressor(),
        'SVM': SVR(),
        'DeepLearning': MLPRegressor(hidden_layer_sizes=(32, 16), max_iter=500, random_state=42)
    }

    best_score = 0
    best_model = None

    for name, model in models.items():
        scores = cross_val_score(model, X_scaled, y, cv=3)
        avg_score = scores.mean()
        print(f"{name} Accuracy: {avg_score:.2f}")

        if avg_score > best_score:
            best_score = avg_score
            best_model = model

    # Fit best model to full data
    best_model.fit(X_scaled, y)

    # Save the model and scaler
    joblib.dump(best_model, "courses/ml/best_model.pkl")
    joblib.dump(scaler, "courses/ml/scaler.pkl")
    print("✅ Best model saved successfully.")