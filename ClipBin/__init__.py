import mysql.connector
from flask import Flask

from ClipBin import config

mysql_ = mysql.connector.connect(
    username=config.user, password=config.password, host=config.host
)
cursor_ = mysql_.cursor()


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)

    with app.app_context():
        from . import views

        cursor_.execute("CREATE DATABASE IF NOT EXISTS ClipBin")
        cursor_.execute(
            "CREATE TABLE IF NOT EXISTS ClipBin.clips (id INT PRIMARY KEY AUTO_INCREMENT, name_ TEXT, content TEXT, date_created DATETIME)"
        )

        return app
