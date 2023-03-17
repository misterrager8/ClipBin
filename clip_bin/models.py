import datetime

from . import config


class Clip(object):
    def __init__(self, name):
        self.name = name

    @classmethod
    def all(cls):
        return sorted(
            [Clip(i.name) for i in config.HOME_DIR.glob("**/*.txt")],
            key=lambda x: x.last_modified,
            reverse=True,
        )

    @classmethod
    def search(cls, query):
        return sorted(
            [
                Clip(i.name)
                for i in config.HOME_DIR.glob("**/*.txt")
                if query.lower() in i.name.lower()
            ],
            key=lambda x: x.last_modified,
            reverse=True,
        )

    @property
    def path(self):
        return config.HOME_DIR / self.name

    @property
    def stem(self):
        return self.path.stem

    @property
    def content(self):
        return open(self.path).read()

    @property
    def date_created(self) -> datetime.datetime:
        return datetime.datetime.fromtimestamp(self.path.stat().st_birthtime)

    @property
    def last_modified(self) -> datetime.datetime:
        return datetime.datetime.fromtimestamp(self.path.stat().st_mtime)

    def create(self):
        self.path.touch()

    def edit(self, content: str):
        open(self.path, "w").write(content)

    def rename(self, new_name: str):
        self.path.rename(config.HOME_DIR / new_name)

    def delete(self):
        self.path.unlink()

    def to_dict(self):
        return dict(
            name=self.name,
            path=str(self.path),
            stem=self.stem,
            content=self.content,
            date_created=self.date_created.strftime("%-m-%-d-%Y @ %I:%M %p"),
            last_modified=self.last_modified.strftime("%-m-%-d-%Y @ %I:%M %p"),
        )
