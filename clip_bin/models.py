import datetime
import json
from pathlib import Path

from clip_bin import config


class Clip(object):
    def __init__(self, name: str):
        self.name = name

    @property
    def path(self) -> Path:
        return config.HOME_DIR / "clips" / self.name

    @property
    def stem(self) -> str:
        return self.path.stem

    @property
    def suffix(self) -> str:
        return self.path.suffix

    @property
    def content(self) -> str:
        return open(self.path).read()

    @property
    def last_modified(self) -> datetime.datetime:
        return datetime.datetime.fromtimestamp(self.path.stat().st_birthtime)

    @property
    def favorited(self) -> bool:
        return self.name in [i.name for i in Clip.favorites()]

    @classmethod
    def all(cls) -> list:
        return [
            Clip(i.name) for i in (config.HOME_DIR / "clips").iterdir() if i.is_file()
        ]

    @classmethod
    def favorites(cls) -> list:
        with open(config.HOME_DIR / "favorites.json") as favs:
            data = json.load(favs)
        return [Clip(i) for i in data]

    @classmethod
    def get(cls, name: str):
        return Clip(name)

    def edit(self, content: str):
        open(self.path, "w").write(content)

    def favorite(self):
        with open(config.HOME_DIR / "favorites.json") as favs:
            data = json.load(favs)
        if self.name in data:
            data.remove(self.name)
        else:
            data.append(self.name)

        with open((config.HOME_DIR / "favorites.json"), "w") as favs:
            json.dump(data, favs)

    def to_dict(self) -> dict:
        return dict(
            name=self.name,
            path=str(self.path),
            stem=self.stem,
            suffix=self.suffix,
            content=self.content,
            favorited=self.favorited,
            last_modified=self.last_modified.strftime("%-m/%-d/%y @ %-I:%M %p"),
        )
