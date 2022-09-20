from flask import current_app, redirect, render_template, request

from clip_bin.models import Clip


@current_app.route("/")
def index():
    return render_template("index.html", clips=Clip.all())


@current_app.route("/add_clip", methods=["POST"])
def add_clip():
    Clip(request.form["name_"]).insert()

    return redirect(request.referrer)


@current_app.route("/edit_clip", methods=["POST"])
def edit_clip():
    clip_ = Clip.get(int(request.args.get("id_")))

    clip_.name_ = request.form["name_"]
    clip_.content = request.form["content"]
    clip_.edit()
    return redirect(request.referrer)


@current_app.route("/clip_delete")
def clip_delete():
    clip_ = Clip.get(int(request.args.get("id_")))
    clip_.delete()

    return redirect(request.referrer)
