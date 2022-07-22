from flask import (
    current_app,
    render_template,
    request,
    redirect,
    url_for,
    send_from_directory,
)
from ClipBin.models import Clip
from ClipBin import db
import datetime
import os


@current_app.route("/")
def index():
    return render_template(
        "index.html", clips=Clip.query.order_by(db.text("date_created desc")).all()
    )


@current_app.route("/create_clip", methods=["POST"])
def create_clip():
    clip_ = Clip(
        title=request.form["title"], content="", date_created=datetime.datetime.now()
    )
    db.session.add(clip_)
    db.session.commit()

    return redirect(url_for("editor", id_=clip_.id))


@current_app.route("/editor", methods=["GET", "POST"])
def editor():
    clip_ = Clip.query.get(int(request.args.get("id_")))
    if request.method == "GET":
        return render_template("editor.html", clip_=clip_)
    else:
        clip_.title = request.form["title"]
        clip_.content = request.form["content"]
        db.session.commit()

        return redirect(request.referrer)


@current_app.route("/delete_clip")
def delete_clip():
    clip_ = Clip.query.get(int(request.args.get("id_")))
    db.session.delete(clip_)
    db.session.commit()

    return redirect(request.referrer)


@current_app.route("/download_clip", methods=["GET", "POST"])
def download_clip():
    clip_ = Clip.query.get(int(request.args.get("id_")))
    with open(os.path.join(os.getcwd(), "downloads", clip_.title), "w") as f:
        f.write(clip_.content)

    return send_from_directory(
        directory=os.path.join(os.getcwd(), "downloads"),
        path=clip_.title,
        as_attachment=True,
    )
