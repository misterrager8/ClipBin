import pathlib
import subprocess
import webbrowser

import click
import pyperclip

from clip_bin import config, create_app
from clip_bin.models import Clip


@click.group()
def cli():
    """ClipBin"""
    pass


@cli.command()
@click.argument("name")
def add(name):
    """Create a new clip."""
    clip_ = Clip(name + ".txt")
    clip_.create()

    click.secho("Created.", fg="magenta")


@cli.command()
@click.argument("file", type=click.Path())
def add_from_file(file):
    """Create a new clip from a file."""
    src = pathlib.Path(file)
    clip_ = Clip(f"{src.stem}-{src.suffix.strip('.')}.txt")
    clip_.create()
    clip_.edit(open(src).read())

    click.secho("Created.", fg="magenta")


@cli.command()
@click.argument("name")
def add_with(name):
    """Create a new clip with content."""
    subprocess.run(["vi", (config.HOME_DIR / f"{name}.txt")])

    click.secho("Created.", fg="magenta")


@cli.command()
def view_all():
    """View a list of clips."""
    click.secho(
        "\n".join([f"[{id}] {i.stem}" for id, i in enumerate(Clip.all())]),
        fg="magenta",
    )


@cli.command()
@click.option(
    "--id",
    help="View contents of this clip.",
    prompt="\n".join([f"[{id}] {i.stem}" for id, i in enumerate(Clip.all())]) + "\n",
)
def view(id):
    """View contents of this clip."""
    clip_ = Clip.all()[int(id)]

    click.secho(clip_.content, fg="magenta")


@cli.command()
@click.option(
    "--id",
    prompt="\n".join([f"[{id}] {i.stem}" for id, i in enumerate(Clip.all())]) + "\n",
)
@click.option(
    "-n",
    "--name",
    help="New name of the clip.",
    prompt=True,
)
def rename(id, name):
    """Rename this clip."""
    clip_ = Clip.all()[int(id)]
    clip_.rename(name + ".txt")

    click.secho("Renamed.", fg="magenta")


@cli.command()
@click.option(
    "--id",
    help="Copy this clip.",
    prompt="\n".join([f"[{id}] {i.stem}" for id, i in enumerate(Clip.all())]) + "\n",
)
def copy(id):
    """Copy a clip to the clipboard."""
    clip_ = Clip.all()[int(id)]
    pyperclip.copy(clip_.content)

    click.secho("Copied.", fg="magenta")


@cli.command()
@click.option(
    "--id",
    help="Delete this clip.",
    prompt="\n".join([f"[{id}] {i.stem}" for id, i in enumerate(Clip.all())]) + "\n",
)
def delete(id):
    """Delete a clip."""
    clip_ = Clip.all()[int(id)]
    clip_.delete()

    click.secho("Deleted.", fg="magenta")


@cli.command()
@click.option("-d", "--debug", is_flag=True, help="Run in development mode")
@click.option(
    "-p",
    "--port",
    help="4-digit port number to run on. Default is 5000",
    default="5000",
)
def web(debug, port):
    """Launch web interface."""
    app = create_app(config)
    if not debug:
        webbrowser.open(f"http://localhost:{port}")
    app.run(debug=debug, port=port)
