from pathlib import Path
from clipbin.config import HOME_DIR


class Clip:
    def __init__(self, path):
        self.path = Path(path)

    @classmethod
    def add(cls, name):
        clip_ = Clip(HOME_DIR / f"{name}.jinja")
        clip_.path.touch()

        return clip_

    @classmethod
    def all(cls):
        return [Clip(i) for i in HOME_DIR.glob("**/*.jinja")]

    @property
    def content(self):
        return open(self.path).read()

    def edit(self, content):
        open(self.path, "w").write(content)

    def delete(self):
        self.path.unlink()

    def asdict(self):
        return {"path": str(self.path), "name": self.path.stem, "content": self.content}
