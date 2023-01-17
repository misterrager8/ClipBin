import datetime
import json

from jinja2 import Environment, FileSystemLoader

from clip_bin import config

with open(config.HOME_DIR / "templates.json") as f:
    data = json.load(f)


def refresh_data():
    with open(config.HOME_DIR / "templates.json") as f:
        data = json.load(f)


class Template(object):
    def __init__(self, name):
        self.name = name

    @classmethod
    def all(cls):
        """Get all templates."""
        return [
            Template(i.name)
            for i in config.HOME_DIR.iterdir()
            if i.is_file() and i.name != "templates.json" and i.name != ".DS_Store"
        ]

    @property
    def variables(self):
        """Get variables associated with this template."""
        _ = []
        if self.name in data.keys():
            for i in data[self.name]:
                for j in i:
                    _.append(j)
        else:
            data.update({self.name: []})
            with open(config.HOME_DIR / "templates.json", "w") as f:
                json.dump(data, f, indent=4)
            refresh_data()

        return _

    @property
    def content(self):
        """Get text content of this template."""
        return open(config.HOME_DIR / self.name).read()

    @property
    def date_created(self):
        """Datetime of file creation."""
        return datetime.datetime.fromtimestamp(
            (config.HOME_DIR / self.name).stat().st_birthtime
        )

    def create(self):
        """Create a new template."""
        (config.HOME_DIR / self.name).touch()

    def edit(self, text_):
        """Edit the text content of a template."""
        open(config.HOME_DIR / self.name, "w").write(text_)

    def set_variables(self, variables_: list):
        """Add or remove variables in a template.

        Args:
            variables_: list of dicts (variable name is key, value should be
              empty string by default, for easy Jinja formatting)
        """
        data.update({self.name: variables_})
        with open(config.HOME_DIR / "templates.json", "w") as f:
            json.dump(data, f, indent=4)
        refresh_data()

    def delete(self):
        """Delete this template."""
        (config.HOME_DIR / self.name).unlink()

    def format_text(self, input_: list):
        """Return the generated template text using the input provided."""
        env = Environment(loader=FileSystemLoader(config.HOME_DIR))
        template = env.get_template(self.name)

        params = data
        for idx, i in enumerate(self.variables):
            params.update({i: input_[idx]})

        return template.render(params)

    def to_dict(self):
        """Dict representation of this template, for JSON compatibility."""
        return dict(
            name=self.name,
            content=self.content,
            variables=self.variables,
            date_created=self.date_created.strftime("%-m/%-d/%y @ %-I:%M %p"),
        )
