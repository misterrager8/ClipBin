from flask import current_app, render_template, request

from clip_bin.models import Clip


@current_app.route("/")
def index():
    return render_template("index.html")


@current_app.route("/create_clip", methods=["POST"])
def create_clip():
    clip_ = Clip(request.form.get("name"))
    clip_.path.touch()
    return ""


@current_app.route("/get_clips")
def get_clips():
    return dict(clips=[i.to_dict() for i in Clip.all()])


@current_app.route("/get_favorites")
def get_favorites():
    return dict(favorites=[i.to_dict() for i in Clip.favorites()])


@current_app.route("/get_clip")
def get_clip():
    clip_ = Clip.get(request.args.get("name"))
    return clip_.to_dict()


@current_app.route("/edit_clip", methods=["POST"])
def edit_clip():
    clip_ = Clip.get(request.form.get("name"))
    clip_.edit(request.form.get("content"))

    return ""


@current_app.route("/delete_clip")
def delete_clip():
    clip_ = Clip.get(request.args.get("name"))
    clip_.path.unlink()

    return ""


@current_app.route("/toggle_favorite")
def toggle_favorite():
    clip_ = Clip.get(request.args.get("name"))
    clip_.favorite()

    return ""


@current_app.route("/get_content")
def get_content():
    clip_ = Clip.get(request.args.get("name"))
    return dict(name=clip_.name, content=clip_.content)
