import os
from pathlib import Path

import dotenv

dotenv.load_dotenv()

PORT = os.getenv("port") or "4999"
HOME_DIR = Path(os.getenv("home_dir") or (Path(__file__).parent / "clips"))

HOME_DIR.mkdir(exist_ok=True)

JSON_DIR = HOME_DIR / "json"
TEMPLATE_DIR = HOME_DIR / "templates_"

JSON_DIR.mkdir(exist_ok=True)
TEMPLATE_DIR.mkdir(exist_ok=True)


def get():
    return dotenv.dotenv_values()


def set(key, value):
    dotenv.set_key(dotenv.find_dotenv(), key, value)
