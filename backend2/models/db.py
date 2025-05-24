from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Aquí puedes agregar tus modelos en el futuro
# Ejemplo:
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True, nullable=False)