import datetime

from flask import current_app, render_template, request

from clip_bin import config
from clip_bin.models import Clip, check_duplicate


@current_app.get("/")
def index():
    return render_template("index.html")


@current_app.post("/add")
def add():
    name = f"{datetime.datetime.now().strftime('%y%m%d')}, clip"
    clip_ = Clip(
        config.HOME_DIR / f"{check_duplicate(name, [i.name for i in Clip.all()])}.txt"
    )
    clip_.add()

    return clip_.to_dict()


@current_app.post("/toggle_favorite")
def toggle_favorite():
    clip_ = Clip(request.json.get("path"))
    clip_.toggle_favorite()

    return clip_.to_dict()


@current_app.post("/edit")
def edit():
    clip_ = Clip(request.json.get("path"))
    clip_.edit(request.json.get("content"))

    return clip_.to_dict()


@current_app.post("/rename")
def rename():
    clip_ = Clip(request.json.get("path"))

    return clip_.rename(request.json.get("new_name")).to_dict()


@current_app.post("/delete")
def delete():
    clip_ = Clip(request.json.get("path"))
    clip_.delete()

    return {}


@current_app.post("/clips")
def clips():
    return {"clips": [i.to_dict() for i in Clip.all()]}
