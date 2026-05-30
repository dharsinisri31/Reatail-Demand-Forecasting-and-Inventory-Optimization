
from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)


historical_dates = [
    "Jan","Feb","Mar","Apr","May","Jun","Jul"
]

historical_sales = [
    12000,15000,18000,17000,22000,25000,27000
]


@app.route("/")
def home():
    return "Retail Demand Forecasting API Running"


@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        store = float(data["Store"])

        dept = float(data["Dept"])

        weekly_sales = float(data["Weekly_Sales"])

        holiday = data["Holiday_Flag"]

        temperature = float(data["Temperature"])

        fuel = float(data["Fuel_Price"])

        cpi = float(data["CPI"])

        unemployment = float(data["Unemployment"])

        holiday_bonus = 5000 if holiday == "Yes" else 0

        prediction = (

            weekly_sales * 0.65 +

            store * 1200 +

            dept * 450 +

            holiday_bonus +

            temperature * 25 +

            fuel * 150 +

            cpi * 8 -

            unemployment * 300

        )

        historical_sales.append(round(prediction))

        historical_dates.append(
            "M" + str(len(historical_sales))
        )

        return jsonify({
            "prediction": round(prediction, 2)
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500



@app.route("/historical-data")
def historical_data():

    return jsonify({
        "dates": historical_dates,
        "sales": historical_sales
    })


if __name__ == "__main__":
    app.run(debug=True)
