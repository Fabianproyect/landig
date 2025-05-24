import sys
from os.path import dirname, join
# Asegura que Python encuentre los módulos en el directorio padre
sys.path.append(dirname(dirname(__file__)))

from flask import Flask
from models.db import db
from routes.base_routes import base_blueprint

def create_app():
    app = Flask(__name__)
    
    # Configuración de la base de datos
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://username:password@localhost/db_name'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Inicializar la base de datos
    db.init_app(app)
    
    # Registrar blueprints (rutas)
    app.register_blueprint(base_blueprint)
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)