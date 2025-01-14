from pathlib import Path

import click
from flask import current_app, render_template, request

from clipbin.models import Clip


@current_app.route("/")
def index():
    return render_template(
        "index.html", debug=current_app.config.get("ENV") == "development"
    )


@current_app.post("/about")
def about():
    success = True
    readme_ = ""

    try:
        readme_ = open(Path(__file__).parent.parent / "README.md").read()
    except Exception as e:
        success = False
        click.secho(str(e), fg="blue")

    return {"readme": readme_, "success": success}


@current_app.post("/add_clip")
def add_clip():
    success = True
    clip_ = None

    try:
        clip_ = Clip.add()
    except Exception as e:
        success = False
        click.secho(str(e), fg="blue")

    return {"success": success, "clip": clip_.asdict() if clip_ else None}


@current_app.post("/clips")
def clips():
    success = True
    clips_ = []

    try:
        clips_ = [i.asdict() for i in Clip.all()]
    except Exception as e:
        success = False
        click.secho(str(e), fg="blue")

    return {"clips": clips_, "success": success}


@current_app.post("/edit_clip")
def edit_clip():
    success = True

    try:
        clip_ = Clip(request.json.get("path"))
        clip_.edit(request.json.get("content"))
        clip_.edit_metadata(request.json.get("metadata"))
    except Exception as e:
        success = False
        click.secho(str(e), fg="blue")

    return {"success": success}


@current_app.post("/rename_clip")
def rename_clip():
    success = True
    clip_ = None

    try:
        clip_ = Clip(request.json.get("path"))
        clip_ = clip_.rename(request.json.get("new_name"))
    except Exception as e:
        success = False
        click.secho(str(e), fg="blue")

    return {"success": success, "clip": clip_.asdict()}


@current_app.post("/delete_clip")
def delete_clip():
    success = True

    try:
        clip_ = Clip(request.json.get("path"))
        clip_.delete()
    except Exception as e:
        success = False
        click.secho(str(e), fg="blue")

    return {"success": success}


@current_app.post("/format_clip")
def format_clip():
    success = True
    x = None
    msg = ""

    try:
        clip_ = Clip(request.json.get("path"))
        x = clip_.format_text()
        # click.secho(x, fg="blue")
    except Exception as e:
        success = False
        msg = str(e)
        click.secho(str(e), fg="blue")

    return {"success": success, "formatted": x, "msg": msg}
