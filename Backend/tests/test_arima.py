import warnings
warnings.filterwarnings("ignore")

import pytest

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import json
from src.app import app


#######################################
#### TESTE A REQUISIÇÃO AUTO.ARIMA ####
#######################################

##################################################
# Teste a previsão
def test_forecast_arima():
    """Teste a função arima"""
    data = {"data":[1,2,3,4,5,6,7,8,9,10],"model":"autoarima_python","params":{"alpha":0.8,"n_periods":5,"seasonal":True}}
    rv = app.test_client().post('/forecast', json=data)
    ret = json.loads(rv.data)
    assert [round(v) for v in ret['forecast']] == [11,12,13,14,15]

##################################################
# Teste o intervalo de confiança superior
def test_forecast_arima_conf_int_upper():
    """Teste a função arima"""
    data = {"data":[1,2,3,4,5,6,7,8,9,10],"model":"autoarima_python","params":{"alpha":0.8,"n_periods":5,"seasonal":True}}
    rv = app.test_client().post('/forecast', json=data)
    ret = json.loads(rv.data)
    assert [round(v[0]) for v in ret['conf_int']] == [11,12,13,14,15]

##################################################
# Teste o intervalo de confiança inferior
def test_forecast_arima_conf_int_lower():
    """Teste a função arima"""
    data = {"data":[1,2,3,4,5,6,7,8,9,10],"model":"autoarima_python","params":{"alpha":0.8,"n_periods":5,"seasonal":True}}
    rv = app.test_client().post('/forecast', json=data)
    ret = json.loads(rv.data)
    assert [round(v[1]) for v in ret['conf_int']] == [11,12,13,14,15]
