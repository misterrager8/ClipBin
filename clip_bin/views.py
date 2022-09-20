from flask import current_app, redirect, render_template, request

from clip_bin.models import Clip


@current_app.route("/")
def index():
    return render_template("index.html", clips=Clip.all())


@current_app.route("/clip_add", methods=["POST"])
def clip_add():
    Clip(request.form["name_"]).insert()

    return redirect(request.referrer)


@current_app.route("/editor", methods=["POST", "GET"])
def editor():
    clip_ = Clip.get(int(request.args.get("id_")))
    if request.method == "GET":
        return render_template("editor.html", clip_=clip_)
    else:
        clip_.name_ = request.form["name_"]
        clip_.content = request.form["content"]
        clip_.edit()
        return redirect(request.referrer)


@current_app.route("/clip_delete")
def clip_delete():
    clip_ = Clip.get(int(request.args.get("id_")))
    clip_.delete()

    return redirect(request.referrer)
