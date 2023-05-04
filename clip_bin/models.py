import datetime

import frontmatter

from . import config


class Clip(object):
    def __init__(self, name):
        self.name = name

    @classmethod
    def all(cls):
        return sorted(
            [Clip(i.name) for i in config.HOME_DIR.glob("**/*.txt")],
            key=lambda x: x.favorited,
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
    def frontmatter(self):
        text_ = open(self.path).read()
        frontmatter_ = frontmatter.loads(text_)

        if not frontmatter.checks(text_):
            frontmatter_.metadata.update({"favorited": False})
            open(self.path, "w").write(frontmatter.dumps(frontmatter_))

        return frontmatter_

    @property
    def content(self):
        return self.frontmatter.content

    @property
    def favorited(self):
        return self.frontmatter.metadata.get("favorited")

    @property
    def date_created(self) -> datetime.datetime:
        return datetime.datetime.fromtimestamp(self.path.stat().st_birthtime)

    @property
    def last_modified(self) -> datetime.datetime:
        return datetime.datetime.fromtimestamp(self.path.stat().st_mtime)

    def create(self):
        self.path.touch()

    def edit(self, content: str):
        _ = self.frontmatter
        _.content = content

        open(self.path, "w").write(frontmatter.dumps(_))

    def rename(self, new_name: str):
        self.path.rename(config.HOME_DIR / new_name)

    def toggle_favorite(self):
        _ = self.frontmatter
        _.metadata.update({"favorited": not _.metadata.get("favorited")})

        open(self.path, "w").write(frontmatter.dumps(_))

    def delete(self):
        self.path.unlink()

    def to_dict(self):
        return dict(
            name=self.name,
            path=str(self.path),
            stem=self.stem,
            content=self.content,
            favorited=self.favorited,
            date_created=self.date_created.strftime("%-m-%-d-%Y @ %I:%M %p"),
            last_modified=self.last_modified.strftime("%-m-%-d-%Y @ %I:%M %p"),
        )
