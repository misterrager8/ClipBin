import datetime

from flask import current_app, render_template, request

from .models import Clip


@current_app.get("/")
def index():
    return render_template("index.html")


@current_app.post("/create_clip")
def create_clip():
    clip_ = Clip(f"Clip {datetime.datetime.now().strftime('%H%M%S')}.txt")
    clip_.create()

    return clip_.to_dict()


@current_app.post("/clips")
def clips():
    return {"clips": [i.to_dict() for i in Clip.all()]}


@current_app.post("/search")
def search():
    return dict(results=[i.to_dict() for i in Clip.search(request.json.get("query"))])


@current_app.post("/clip")
def clip():
    clip_ = Clip(request.json.get("name"))

    return clip_.to_dict()


@current_app.post("/rename_clip")
def rename_clip():
    clip_ = Clip(request.json.get("name"))
    clip_.rename(request.json.get("new_name") + ".txt")

    return Clip(request.json.get("new_name") + ".txt").to_dict()


@current_app.post("/edit_clip")
def edit_clip():
    clip_ = Clip(request.json.get("name"))
    clip_.edit(request.json.get("content"))

    return clip_.to_dict()


@current_app.post("/delete_clip")
def delete_clip():
    clip_ = Clip(request.json.get("name"))
    clip_.delete()

    return {"status": "done"}


@current_app.post("/toggle_favorite")
def toggle_favorite():
    clip_ = Clip(request.json.get("name"))
    clip_.toggle_favorite()

    return clip_.to_dict()
