import pandas as pd
import numpy as np
import joblib

from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import LSTM, Dense, Dropout

df = pd.read_csv("backend/dataset/Walmart.csv")

sales = df["Weekly_Sales"].values.reshape(-1,1)



scaler = MinMaxScaler()

sales_scaled = scaler.fit_transform(sales)

joblib.dump(scaler, 'backend/scaler/scaler.pkl')

# create sequences

X=[]
y=[]

window=10

for i in range(window,len(sales_scaled)):
    X.append(
        sales_scaled[i-window:i]
    )
    y.append(
        sales_scaled[i]
    )

X=np.array(X)
y=np.array(y)


model=Sequential()

model.add(
    LSTM(
        64,
        return_sequences=True,
        input_shape=(X.shape[1],1)
    )
)

model.add(
    Dropout(0.2)
)

model.add(
    LSTM(64)
)

model.add(
    Dense(1)
)

model.compile(
    optimizer='adam',
    loss='mse',
    metrics=['mae']
)

history=model.fit(
    X,
    y,
    epochs=50,
    batch_size=32,
    validation_split=0.2
)

model.save('backend/models/lstm_model.keras')

print("Training Completed")