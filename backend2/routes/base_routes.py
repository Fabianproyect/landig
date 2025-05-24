from flask import Blueprint, jsonify

base_blueprint = Blueprint('base', __name__)

@base_blueprint.route('/')
def home():
    return jsonify({
        'message': 'Bienvenido a la API Flask con MySQL',
        'status': 'success',
        'endpoints': {
            'home': '/',
            'health': '/health'
        }
    })

@base_blueprint.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'database': 'MySQL'
    })

# Aquí puedes agregar más endpoints en el futuro