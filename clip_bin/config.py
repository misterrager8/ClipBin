import os

import dotenv

dotenv.load_dotenv()

ENV = os.getenv("env")
DEBUG = os.getenv("debug")
CLI_COLOR = os.getenv("cli_color")

SQLALCHEMY_DATABASE_URI = os.getenv("db")
SQLALCHEMY_TRACK_MODIFICATIONS = False
PORT = os.getenv("port") or "5000"
