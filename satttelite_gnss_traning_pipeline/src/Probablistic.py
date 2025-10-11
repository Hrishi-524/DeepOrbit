import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, Model

class ProbabilisticModel:
    """Probabilistic model - simplified to match other models"""
    
    def __init__(self, input_shape, output_steps):
        self.model = self._build(input_shape, output_steps)
    
    def _build(self, input_shape, output_steps):
        inputs = layers.Input(shape=input_shape)
        x = layers.LSTM(64, return_sequences=True)(inputs)
        x = layers.Dropout(0.3)(x)
        x = layers.LSTM(32)(x)
        x = layers.Dropout(0.3)(x)
        x = layers.Dense(32, activation='relu')(x)
        
        # Only return mean (simplified)
        outputs = layers.Dense(output_steps)(x)
        
        model = Model(inputs, outputs)
        model.compile(optimizer='adam', loss='mse', metrics=['mae'])
        return model
    
    def train(self, X, y, epochs=30, batch_size=16, val_split=0.15):
        if y.ndim == 3:
            y = y.squeeze(-1)
        
        callbacks = [
            tf.keras.callbacks.EarlyStopping(patience=10, restore_best_weights=True, verbose=0),
            tf.keras.callbacks.ReduceLROnPlateau(patience=5, factor=0.5, verbose=0)
        ]
        
        return self.model.fit(X, y, epochs=epochs, batch_size=batch_size,
                            validation_split=val_split, callbacks=callbacks, verbose=0)
    
    def predict(self, X):
        return self.model.predict(X, verbose=0)