import os

import dotenv

dotenv.load_dotenv()

ENV = os.getenv("env")
DEBUG = os.getenv("debug")
CLI_COLOR = os.getenv("cli_color")

user = os.getenv("user")
password = os.getenv("password")
host = os.getenv("host")
