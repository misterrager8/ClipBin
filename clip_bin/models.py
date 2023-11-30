import datetime
from pathlib import Path

import frontmatter

from clip_bin import config


def check_duplicate(name: str, list_of_names: list) -> str:
    """Check if a filename is found. If true, return filename with an int appended to the end. Return original name if false."""
    name = name.strip()
    if name in list_of_names:
        if (name[-1]).isdigit():
            num = int(name[-1])
            return check_duplicate(name[:-1] + f"{str(num + 1)}", list_of_names)
        else:
            return check_duplicate(f"{name} 2", list_of_names)
    else:
        return name


class Clip:
    def __init__(self, path):
        self.path = Path(path)

    @property
    def frontmatter(self):
        _ = frontmatter.load(self.path)
        if not frontmatter.check(self.path):
            _.metadata.update({"favorited": False})

        return _

    @property
    def content(self):
        return self.frontmatter.content

    @property
    def favorited(self):
        return self.frontmatter.metadata.get("favorited") or False

    @property
    def name(self):
        return self.path.stem

    @property
    def date_created(self) -> datetime.datetime:
        return datetime.datetime.fromtimestamp(self.path.stat().st_birthtime)

    def add(self):
        self.path.touch()

    def edit_frontmatter(self, metadata: dict):
        new_data = frontmatter.dumps(metadata)
        open(self.path, "w").write(new_data)

    @classmethod
    def all(cls):
        return sorted(
            [Clip(i) for i in config.HOME_DIR.glob("**/*.txt")],
            reverse=True,
            key=lambda x: (x.favorited, x.date_created),
        )

    @classmethod
    def search(cls, query):
        return [i for i in Clip.all() if query.lower() in i.name.lower()]

    def edit(self, content: str):
        _ = self.frontmatter
        _.content = content
        self.edit_frontmatter(_)

    def rename(self, new_name: str):
        new_path = config.HOME_DIR / f"{new_name}.txt"
        self.path.rename(new_path)
        return Clip(new_path)

    def toggle_favorite(self):
        _ = self.frontmatter
        _.metadata.update({"favorited": not _.metadata.get("favorited")})
        self.edit_frontmatter(_)

    def delete(self):
        self.path.unlink()

    def __str__(self):
        return f"{'*' if self.favorited else ' '} {self.name}"

    def to_dict(self):
        return {
            "name": self.name,
            "path": str(self.path),
            "content": self.content,
            "favorited": self.favorited,
        }
