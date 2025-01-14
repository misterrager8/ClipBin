import datetime
import json
from pathlib import Path

import click
from jinja2 import Environment, FileSystemLoader

from clipbin import config
from clipbin.config import HOME_DIR, JSON_DIR, TEMPLATE_DIR


class Clip:
    def __init__(self, path):
        self.path = Path(path)

    @classmethod
    def add(cls, name=None):
        name_ = name or datetime.datetime.now().strftime("%Y-%m-%d, %H-%M-%S")
        clip_ = Clip(TEMPLATE_DIR / f"{name_}.jinja")
        clip_.path.touch()

        (JSON_DIR / f"{name_}.json").touch()
        json.dump({}, open(JSON_DIR / f"{name_}.json", "w"))

        return clip_

    @classmethod
    def all(cls):
        return [Clip(i) for i in TEMPLATE_DIR.glob("**/*.jinja")]

    @property
    def content(self):
        return open(self.path).read()

    def edit(self, content):
        open(self.path, "w").write(content)

    def rename(self, new_name):
        json_path = JSON_DIR / f"{self.path.stem}.json"
        jinja_path = TEMPLATE_DIR / f"{self.path.stem}.jinja"

        json_path.rename(JSON_DIR / f"{new_name}.json")
        jinja_path.rename(TEMPLATE_DIR / f"{new_name}.jinja")

        return Clip(TEMPLATE_DIR / f"{new_name}.jinja")

    def edit_metadata(self, new_metadata):
        open(JSON_DIR / f"{self.path.stem}.json", "w").write(str(new_metadata))

    def delete(self):
        self.path.unlink()
        (JSON_DIR / f"{self.path.stem}.json").unlink()

    def format_text(self):
        """Return the generated template text using the input provided."""
        env = Environment(loader=FileSystemLoader(config.TEMPLATE_DIR))
        template = env.get_template(self.path.name)

        params = json.load(open(JSON_DIR / f"{self.path.stem}.json"))

        # for idx, i in enumerate(params.keys()):
        #     params.update({i: input_[idx]})

        return template.render(params)

    @property
    def metadata(self):
        """Return the generated template text using the input provided."""
        env = Environment(loader=FileSystemLoader(config.TEMPLATE_DIR))
        template = env.get_template(self.path.name)

        params = json.load(open(JSON_DIR / f"{self.path.stem}.json"))

        # for idx, i in enumerate(params.keys()):
        #     params.update({i: input_[idx]})

        return params or {}

    def asdict(self):
        return {
            "path": str(self.path),
            "name": self.path.stem,
            "content": self.content,
            "metadata": self.metadata,
        }
