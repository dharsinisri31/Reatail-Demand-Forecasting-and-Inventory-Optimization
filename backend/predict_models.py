import numpy as np
import pandas as pd
import joblib
from keras.models import load_model

lstm_model = load_model('backend/models/lstm_model.keras')
gru_model = load_model('backend/models/gru_model.keras')

scaler = joblib.load('backend/scaler/scaler.pkl')



df = pd.read_csv("backend/dataset/Walmart.csv")

sales = df['Weekly_Sales'].values.reshape(-1,1)

scaled_sales = scaler.transform(sales)

def predict_models(features):

    last_10 = scaled_sales[-10:]

    X = np.array([last_10])

    lstm_prediction = lstm_model.predict(X, verbose=0)
    gru_prediction = gru_model.predict(X, verbose=0)

    lstm_prediction = scaler.inverse_transform(lstm_prediction)
    gru_prediction = scaler.inverse_transform(gru_prediction)

    lstm_value = float(lstm_prediction[0][0])
    gru_value = float(gru_prediction[0][0])
    suggested_inventory = lstm_value * 1.2

    safety_stock = lstm_value * 0.3

    if suggested_inventory < 100:

        stock_alert = "LOW STOCK ALERT"

    elif suggested_inventory > 1000:

        stock_alert = "OVERSTOCK WARNING"

    else:

        stock_alert = "STOCK LEVEL NORMAL"
    if lstm_value > gru_value:

        recommendation = (
        "Increase inventory planning. "
        "LSTM predicts higher future demand."
    )

    else:

     recommendation = (
        "Optimize warehouse stock levels. "
        "GRU predicts higher future demand."
    )

    inventory_gap = abs(lstm_value - gru_value)

    efficiency_score = 100 - (inventory_gap / 1000)

    return {

    'suggested_inventory': round(suggested_inventory, 2),

    'safety_stock': round(safety_stock, 2),

    'stock_alert': stock_alert,
    
    'lstm_prediction': round(lstm_value, 2),

    'gru_prediction': round(gru_value, 2),

    'inventory_gap': round(inventory_gap, 2),

    'efficiency_score': round(efficiency_score, 2),

    'recommendation': recommendation
    
    }