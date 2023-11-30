import datetime
import pprint
import subprocess
import webbrowser

import click
import pyperclip

from clip_bin.models import Clip, check_duplicate

from . import config, create_app


def secho(msg: str):
    click.secho(msg, fg=config.CLI_COLOR)


@click.group()
def cli():
    pass


@cli.command()
def get_config():
    secho(pprint.pformat(config.get()))


@cli.command()
@click.argument("key")
@click.argument("value")
def set_config(key, value):
    config.set(key, value)

    secho(f"{key} set to {value}")


@cli.command()
@click.option("-d", "--debug", is_flag=True)
def web(debug):
    app = create_app(config)
    if not debug:
        webbrowser.open(f"http://localhost:{config.PORT}")
    app.run(debug=debug, port=config.PORT)


@cli.command()
def add():
    name = f"{datetime.datetime.now().strftime('%y%m%d')}, clip"
    clip_ = Clip(
        config.HOME_DIR / f"{check_duplicate(name, [i.name for i in Clip.all()])}.txt"
    )
    clip_.add()
    subprocess.run([config.EDITOR, clip_.path])

    secho(f"{clip_.name} created.")


@cli.command()
@click.option(
    "--id",
    prompt="\n".join([f"[{idx}] {str(i)}" for idx, i in enumerate(Clip.all())]) + "\n",
    type=click.INT,
)
def toggle_favorite(id):
    clip_ = Clip.all()[id]
    clip_.toggle_favorite()

    secho(f"{clip_.name} toggled as favorite.")


@cli.command()
@click.option(
    "--id",
    prompt="\n".join([f"[{idx}] {str(i)}" for idx, i in enumerate(Clip.all())]) + "\n",
    type=click.INT,
)
def edit(id):
    clip_ = Clip.all()[id]
    subprocess.run([config.EDITOR, clip_.path])

    secho("Editing.")


@cli.command()
@click.option(
    "--id",
    prompt="\n".join([f"[{idx}] {str(i)}" for idx, i in enumerate(Clip.all())]) + "\n",
    type=click.INT,
)
def copy(id):
    clip_ = Clip.all()[id]
    pyperclip.copy(clip_.content)

    secho(f"{clip_.name} copied.")


@cli.command()
@click.option(
    "--id",
    prompt="\n".join([f"[{idx}] {str(i)}" for idx, i in enumerate(Clip.all())]) + "\n",
    type=click.INT,
)
def delete(id):
    clip_ = Clip.all()[id]
    clip_.delete()

    secho(f"{clip_.name} deleted.")


@cli.command()
@click.option(
    "--id",
    prompt="\n".join([f"[{idx}] {str(i)}" for idx, i in enumerate(Clip.all())]) + "\n",
    type=click.INT,
)
def delete(id):
    clip_ = Clip.all()[id]
    clip_.delete()

    secho(f"{clip_.name} deleted.")


@cli.command()
def view_all():
    secho("\n".join([f"[{idx}] {str(i)}" for idx, i in enumerate(Clip.all())]))
