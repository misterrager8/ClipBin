from flask import current_app, jsonify, render_template, request

from clip_bin.models import Template


@current_app.route("/")
def index():
    return render_template("index.html")


@current_app.route("/add_template", methods=["POST"])
def add_template():
    template_ = Template(request.form.get("name"))
    template_.create()

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
    input_ = [i.split("=")[1] for i in request.form.get("params").split("&")]

    return template_.format_text(input_)


@current_app.route("/delete_template")
def delete_template():
    template_ = Template(request.args.get("name"))
    template_.delete()

    return ""
