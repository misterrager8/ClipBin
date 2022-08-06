import dotenv
import os

dotenv.load_dotenv()

ENV = os.getenv("env")
DEBUG = os.getenv("debug")

user = os.getenv("user")
password = os.getenv("password")
host = os.getenv("host")
