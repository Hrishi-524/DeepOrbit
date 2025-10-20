import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, Model

class TransformerModel:
    """Simple Transformer for time series"""
    
    def __init__(self, input_shape, output_steps):
        self.model = self._build(input_shape, output_steps)
    
    def _build(self, input_shape, output_steps):
        seq_length, num_features = input_shape
        
        inputs = layers.Input(shape=input_shape)
        x = layers.Dense(64)(inputs)
        
        # Fixed positional encoding
        pos_encoding = self._get_positional_encoding(seq_length, 64)
        x = x + pos_encoding
        
        # Transformer block
        attn = layers.MultiHeadAttention(num_heads=4, key_dim=16)(x, x)
        x = layers.LayerNormalization()(x + attn)
        
        ff = layers.Dense(128, activation='relu')(x)
        ff = layers.Dense(64)(ff)
        x = layers.LayerNormalization()(x + ff)
        
        x = layers.GlobalAveragePooling1D()(x)
        x = layers.Dense(64, activation='relu')(x)
        outputs = layers.Dense(output_steps)(x)
        
        model = Model(inputs, outputs)
        model.compile(optimizer='adam', loss='mse', metrics=['mae'])
        return model
    
    def _get_positional_encoding(self, seq_length, d_model):
        """Create positional encoding"""
        positions = np.arange(seq_length)[:, np.newaxis]
        dims = np.arange(d_model)[np.newaxis, :]
        
        angles = positions / np.power(10000, (2 * (dims // 2)) / d_model)
        
        pos_encoding = np.zeros((seq_length, d_model))
        pos_encoding[:, 0::2] = np.sin(angles[:, 0::2])
        pos_encoding[:, 1::2] = np.cos(angles[:, 1::2])
        
        return tf.constant(pos_encoding, dtype=tf.float32)
    
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