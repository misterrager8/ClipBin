from flask import current_app, render_template, redirect, request
from ClipBin.database import Database
from ClipBin.models import Clip

db = Database()


@current_app.route("/")
def index():
    return render_template("index.html", clips=db.get_clips())


@current_app.route("/clip_add", methods=["POST"])
def clip_add():
    clip_ = Clip(request.form["name_"])
    db.add_clip(clip_)

    return redirect(request.referrer)


@current_app.route("/editor", methods=["POST", "GET"])
def editor():
    clip_ = db.get_clip(int(request.args.get("id_")))
    if request.method == "GET":
        return render_template("editor.html", clip_=clip_)
    else:
        clip_.name_ = request.form["name_"]
        clip_.content = request.form["content"]
        db.edit_clip(clip_)
        return redirect(request.referrer)


@current_app.route("/clip_delete")
def clip_delete():
    db.delete_clip(int(request.args.get("id_")))

    return redirect(request.referrer)
