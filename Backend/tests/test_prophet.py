import warnings
warnings.filterwarnings("ignore")

import pytest

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import json
from src.app import app


def test_forecast_prophet():
    warnings.filterwarnings("ignore")
    """Teste a função arima"""
    data = {"data":[1,2,3,4,5,6,7,8,9,10],"model":"prophet_python","params":{"alpha":0.8,"n_periods":5,"seasonal":True}}
    rv = app.test_client().post('/forecast', json=data)
    ret = json.loads(rv.data)
    assert [round(v) for v in ret['forecast']] == [11,12,13,14,15]

def test_forecast_prophet_conf_int_upper():
    warnings.filterwarnings("ignore")
    """Teste a função arima"""
    data = {"data":[1,2,3,4,5,6,7,8,9,10],"model":"prophet_python","params":{"alpha":0.8,"n_periods":5,"seasonal":True}}
    rv = app.test_client().post('/forecast', json=data)
    ret = json.loads(rv.data)
    assert [round(v[0]) for v in ret['conf_int']] == [11,12,13,14,15]

def test_forecast_prophet_conf_int_lower():
    warnings.filterwarnings("ignore")
    """Teste a função arima"""
    data = {"data":[1,2,3,4,5,6,7,8,9,10],"model":"prophet_python","params":{"alpha":0.8,"n_periods":5,"seasonal":True}}
    rv = app.test_client().post('/forecast', json=data)
    ret = json.loads(rv.data)
    assert [round(v[1]) for v in ret['conf_int']] == [11,12,13,14,15]
