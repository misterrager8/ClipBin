import datetime
import json

from jinja2 import Environment, FileSystemLoader

from clip_bin import config

with open(config.HOME_DIR / "templates.json") as f:
    data = json.load(f)


class Template(object):
    def __init__(self, name):
        self.name = name

    @classmethod
    def all(cls):
        return [
            Template(i.name)
            for i in config.HOME_DIR.iterdir()
            if i.is_file() and i.name != "templates.json"
        ]

    @property
    def variables(self):
        _ = []
        if self.name in data.keys():
            for i in data[self.name]:
                for j in i:
                    _.append(j)

        return _

    @property
    def content(self):
        return open(config.HOME_DIR / self.name).read()

    @property
    def date_created(self):
        return datetime.datetime.fromtimestamp(
            (config.HOME_DIR / self.name).stat().st_birthtime
        )

    def create(self):
        (config.HOME_DIR / self.name).touch()

    def delete(self):
        (config.HOME_DIR / self.name).unlink()

    def format_text(self, input_: list):
        env = Environment(loader=FileSystemLoader(config.HOME_DIR))
        template = env.get_template(self.name)

        params = data
        for idx, i in enumerate(self.variables):
            params.update({i: input_[idx]})

        return template.render(params)

    def to_dict(self):
        return dict(
            name=self.name,
            content=self.content,
            variables=self.variables,
            date_created=self.date_created.strftime("%-m/%-d/%y @ %-I:%M %p"),
        )
