import datetime

from flask import current_app, render_template, request

from .models import Clip


@current_app.get("/")
def index():
    return render_template("index.html")


@current_app.get("/create_clip")
def create_clip():
    clip_ = Clip(f"Clip {datetime.datetime.now().strftime('%H%M%S')}.txt")
    clip_.create()

    return clip_.to_dict()


@current_app.get("/clips")
def clips():
    return {"clips": [i.to_dict() for i in Clip.all()]}


@current_app.post("/search")
def search():
    return dict(results=[i.to_dict() for i in Clip.search(request.form.get("query"))])


@current_app.get("/clip")
def clip():
    clip_ = Clip(request.args.get("name"))

    return clip_.to_dict()


@current_app.post("/rename_clip")
def rename_clip():
    clip_ = Clip(request.form.get("name"))
    clip_.rename(request.form.get("new_name") + ".txt")

    return Clip(request.form.get("new_name") + ".txt").to_dict()


@current_app.post("/edit_clip")
def edit_clip():
    clip_ = Clip(request.form.get("name"))
    clip_.edit(request.form.get("content"))

    return clip_.to_dict()


@current_app.get("/delete_clip")
def delete_clip():
    clip_ = Clip(request.args.get("name"))
    clip_.delete()

    return ""


@current_app.get("/toggle_favorite")
def toggle_favorite():
    clip_ = Clip(request.args.get("name"))
    clip_.toggle_favorite()

    return clip_.to_dict()
