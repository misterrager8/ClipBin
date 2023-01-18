import os
import urllib
from pathlib import Path

import dotenv
from flask import current_app, jsonify, render_template, request

from clip_bin import config
from clip_bin.models import Template


@current_app.route("/")
def index():
    return render_template("index.html", debug=current_app.config["DEBUG"])


@current_app.route("/add_template", methods=["POST"])
def add_template():
    template_ = Template(f"{request.form.get('name')}.txt")
    template_.create()

    return template_.to_dict()


@current_app.route("/edit_template", methods=["POST"])
def edit_template():
    template_ = Template(request.form.get("name"))
    template_.edit(request.form.get("text"))

    return ""


@current_app.route("/rename_template", methods=["POST"])
def rename_template():
    template_ = Template(request.form.get("name"))
    template_.rename(request.form.get("new_name"))

    return ""


@current_app.route("/set_variables", methods=["POST"])
def set_variables():
    template_ = Template(request.form.get("name"))
    vars_ = request.form.get("variables").split(",")
    template_.set_variables([{i.strip(): ""} for i in vars_])

    return ""


@current_app.route("/get_templates")
def get_templates():
    return dict(templates=[i.to_dict() for i in Template.all()])


@current_app.route("/get_template")
def get_template():
    template_ = Template(request.args.get("name"))
    return template_.to_dict()


@current_app.route("/generate_template", methods=["POST"])
def generate_template():
    template_ = Template(request.form.get("name"))
    input_ = [
        urllib.parse.unquote(i.split("=")[1])
        for i in request.form.get("params").split("&")
    ]

    return template_.format_text(input_)


@current_app.route("/delete_template")
def delete_template():
    template_ = Template(request.args.get("name"))
    template_.delete()

    return ""


@current_app.route("/get_settings", methods=["POST", "GET"])
def get_settings():
    if request.method == "GET":
        return dict(port=config.PORT, home_dir=str(config.HOME_DIR))
    else:
        config_file = Path(__file__).parent.parent / ".env"
        dotenv.set_key(config_file, "port", request.form.get("port"))
        dotenv.set_key(config_file, "home_dir", request.form.get("home_dir"))

        os._exit(0)
        return ""
