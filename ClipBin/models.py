import datetime


class Clip:
    def __init__(
        self,
        name_: str,
        content: str = "",
        date_created=datetime.datetime.now(),
        id_: int = None,
    ):
        self.name_ = name_
        self.content = content
        self.date_created = date_created
        self.id_ = id_
