from flask_api import FlaskAPI
import flask
from flask import request, jsonify
import pmdarima as pm
import uuid
from datetime import datetime

app = FlaskAPI(__name__, static_folder=None)
app.url_map.strict_slashes = False


@app.after_request
def allow_cross_domain(response):
    """Hook to set up response headers."""
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'content-type'
    return response


@app.route('/status', methods=['GET'])
def status():
    return {
        'datetime': datetime.now(),
        'flask': flask.__version__,
        'pmdarima': pm.__version__
    }


@app.route('/forecast/', methods=['POST'])
def forecast():
    code = uuid.uuid4()

    forecast = []
    conf_int = []

    content = request.json
    data = content['data']
    params = content['params']
    if content['model'] == 'autoarima_python':
        forecast, conf_int = execute_autoarima_python(data, params)
    
    return jsonify({
        'id': code,
        'forecast': forecast.tolist(),
        'conf_int': conf_int.tolist()
    })

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