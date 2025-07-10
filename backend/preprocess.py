import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from imblearn.over_sampling import SMOTE

def preprocess_data(df, feature_columns=None):
    df = df.copy()

    # Convert datetime
    df['trans_date_trans_time'] = pd.to_datetime(df['trans_date_trans_time'])
    df['hour'] = df['trans_date_trans_time'].dt.hour
    df['day'] = df['trans_date_trans_time'].dt.day
    df['month'] = df['trans_date_trans_time'].dt.month
    df['weekday'] = df['trans_date_trans_time'].dt.weekday

    # Age from dob
    if 'dob' in df.columns:
        df['dob'] = pd.to_datetime(df['dob'], errors='coerce')
        df['age'] = (df['trans_date_trans_time'] - df['dob']).dt.days // 365
    else:
        df['age'] = -1

    # Drop unnecessary columns
    drop_cols = ['trans_date_trans_time', 'dob', 'cc_num', 'merchant', 'first', 'last',
                 'street', 'city', 'state', 'zip', 'trans_num', 'unix_time', 'gender']
    df.drop(columns=[col for col in drop_cols if col in df.columns], inplace=True)

    # One-hot encode categorical columns
    cat_cols = ['category', 'job']
    df = pd.get_dummies(df, columns=[col for col in cat_cols if col in df.columns], drop_first=True)

    # Align columns if provided
    if feature_columns:
        for col in feature_columns:
            if col not in df.columns:
                df[col] = 0
        df = df[feature_columns]
    else:
        feature_columns = df.columns.tolist()

    return df, feature_columns
