from ClipBin import db


class Clip(db.Model):
    __tablename__ = "clips"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text)
    content = db.Column(db.Text)
    date_created = db.Column(db.DateTime)

    def __init__(self, **kwargs):
        super(Clip, self).__init__(**kwargs)
