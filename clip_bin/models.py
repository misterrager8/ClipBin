import datetime

from clip_bin import cursor_, mysql_


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

    def insert(self):
        cursor_.execute(
            "INSERT INTO ClipBin.clips(name_, content, date_created) VALUES('%s','%s','%s')"
            % (self.name_, self.content, self.date_created)
        )
        mysql_.commit()

    @classmethod
    def get(cls, id_: int):
        cursor_.execute(
            "SELECT name_, content, date_created, id FROM ClipBin.clips WHERE id='%s'"
            % id_
        )
        result = cursor_.fetchone()
        return Clip(result[0], result[1], result[2], result[3])

    @classmethod
    def all(cls):
        cursor_.execute(
            "SELECT name_, content, date_created, id FROM ClipBin.clips ORDER BY id DESC"
        )
        return [Clip(i[0], i[1], i[2], i[3]) for i in cursor_.fetchall()]

    def edit(self):
        cursor_.execute(
            "UPDATE ClipBin.clips SET name_='%s', content='%s' WHERE id='%s'"
            % (self.name_, self.content, self.id_)
        )
        mysql_.commit()

    def delete(self):
        cursor_.execute("DELETE FROM ClipBin.clips WHERE id='%s'" % self.id_)
        mysql_.commit()
