import os
from pathlib import Path

import dotenv

dotenv.load_dotenv()

HOME_DIR = Path(os.getenv("home_dir"))
PORT = os.getenv("port") or "9998"
CLI_COLOR = os.getenv("cli_color") or "green"
EDITOR = os.getenv("editor") or "vi"


def get():
    return dotenv.dotenv_values()


def set(key, value):
    dotenv.set_key(dotenv.find_dotenv(), key, value)
