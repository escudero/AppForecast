from flask_api import FlaskAPI
import flask
from flask import request, jsonify
import pandas as pd
import pmdarima as pm
from fbprophet import Prophet
import uuid
from datetime import datetime

app = FlaskAPI(__name__, static_folder=None)
app.url_map.strict_slashes = False


######################################################
# Valida se o cliente pode ou não uma requisição API
@app.after_request
def allow_cross_domain(response):
    """Hook to set up response headers."""
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'content-type'
    return response


##########################################################
# Retorna a verão das bibliotecas utilizadas na aplicação
@app.route('/status', methods=['GET'])
def status():
    return {
        'datetime': datetime.now(),
        'flask': flask.__version__,
        'pmdarima': pm.__version__
    }


##########################################################
# Função para requisição do formulário da aplicação
@app.route('/forecast/', methods=['POST'])
def forecast():
    code = uuid.uuid4()

    forecast = []
    conf_int = []

    content = request.json
    data = content['data']
    params = content['params']
    # Verifica se o usuário preencheu autoarima ou prophet
    if content['model'] == 'autoarima_python':
        forecast, conf_int = execute_autoarima_python(data, params)
    elif content['model'] == 'prophet_python':
        forecast, conf_int = execute_prophet_python(data, params)
    
    return jsonify({
        'id': code,
        'forecast': forecast.tolist(),
        'conf_int': conf_int.tolist()
    })

##########################################################
# Chamada de exeução do auto.ARIMA
def execute_autoarima_python(data, params):
    alpha = params['alpha']
    seasonal = params['seasonal']
    n_periods = params['n_periods']
    n_periods = n_periods if n_periods <= 1000 else 1000
    model = pm.auto_arima(
        data,
        test='kpss',
        seasonal=seasonal,
        error_action='ignore',
        suppress_warnings=True
    )

    forecast, conf_int = model.predict(n_periods=n_periods, alpha=alpha, return_conf_int=True)
    return forecast, conf_int

##########################################################
# Chamada de exeução do Prophet
def execute_prophet_python(data, params):
    alpha = params['alpha']
    seasonal = params['seasonal']
    n_periods = params['n_periods']
    n_periods = n_periods if n_periods <= 1000 else 1000

    datarange = pd.date_range(start='2000-01-01', freq='D', periods=len(data))
    datadf = pd.DataFrame(zip(data, datarange), columns=['y', 'ds'])
    datadf

    model = Prophet()
    model.fit(datadf)
    future = model.make_future_dataframe(periods=n_periods)
    pred = model.predict(future).iloc[len(data):]
    pred[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
    forecast = pred['yhat'].values
    conf_int = pred[['yhat_lower', 'yhat_upper']].values

    return forecast, conf_int