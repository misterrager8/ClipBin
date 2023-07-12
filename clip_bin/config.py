import os
from pathlib import Path

import click
import dotenv

dotenv.load_dotenv()

HOME_DIR = Path.cwd() / "clips"

try:
    HOME_DIR = Path(os.getenv("home_dir"))
except:
    if not HOME_DIR.exists():
        HOME_DIR.mkdir()
    click.secho("no home dir set. using cwd", fg="blue")
