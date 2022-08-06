import mysql.connector
from ClipBin import config
from ClipBin.models import Clip


class Database:
    def __init__(self):
        self.mysql_ = mysql.connector.connect(
            username=config.user, password=config.password, host=config.host
        )
        self.cursor_ = self.mysql_.cursor()
        self.cursor_.execute("CREATE DATABASE IF NOT EXISTS ClipBin")
        self.cursor_.execute(
            "CREATE TABLE IF NOT EXISTS ClipBin.clips (id INT PRIMARY KEY AUTO_INCREMENT, name_ TEXT, content TEXT, date_created DATETIME)"
        )

    def add_clip(self, clip_: Clip):
        self.cursor_.execute(
            "INSERT INTO ClipBin.clips(name_, content, date_created) VALUES('%s','%s','%s')"
            % (clip_.name_, clip_.content, clip_.date_created)
        )
        self.mysql_.commit()

    def get_clip(self, id_: int):
        self.cursor_.execute(
            "SELECT name_, content, date_created, id FROM ClipBin.clips WHERE id='%s'"
            % id_
        )
        result = self.cursor_.fetchone()
        return Clip(result[0], result[1], result[2], result[3])

    def get_clips(self):
        self.cursor_.execute(
            "SELECT name_, content, date_created, id FROM ClipBin.clips"
        )
        return [Clip(i[0], i[1], i[2], i[3]) for i in self.cursor_.fetchall()]

    def edit_clip(self, clip_: Clip):
        self.cursor_.execute(
            "UPDATE ClipBin.clips SET name_='%s', content='%s' WHERE id='%s'"
            % (clip_.name_, clip_.content, clip_.id_)
        )
        self.mysql_.commit()

    def delete_clip(self, id_: int):
        self.cursor_.execute("DELETE FROM ClipBin.clips WHERE id='%s'" % id_)
        self.mysql_.commit()
