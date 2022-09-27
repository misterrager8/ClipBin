from clip_bin import db


class Clip(db.Model):
    __tablename__ = "clips"

    name_ = db.Column(db.Text)
    content = db.Column(db.Text)
    date_created = db.Column(db.DateTime)
    id = db.Column(db.Integer, primary_key=True)

    def __init__(self, **kwargs):
        super(Clip, self).__init__(**kwargs)

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def edit(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
