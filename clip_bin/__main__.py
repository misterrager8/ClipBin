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
@click.option("-n", "--name", help="Name of the new clip.", prompt=True)
def create_clip(name):
    """Create a new clip."""
    clip_ = Clip(name + ".txt")
    clip_.create()

    click.secho("Created.", fg="magenta")


@cli.command()
@click.option(
    "-n",
    "--name",
    help="Copy this clip.",
    prompt="\n".join([i.stem for i in Clip.all()]),
)
def copy_clip(name):
    """Copy a clip to the clipboard."""
    clip_ = Clip(name + ".txt")
    pyperclip.copy(clip_.content)

    click.secho("Copied.", fg="magenta")


@cli.command()
@click.option(
    "-n",
    "--name",
    help="Delete this clip.",
    prompt="\n".join([i.stem for i in Clip.all()]),
)
def delete_clip(name):
    """Delete a clip."""
    clip_ = Clip(name + ".txt")
    clip_.delete()

    click.secho("Deleted.", fg="magenta")


@cli.command()
@click.option("-d", "--debug", is_flag=True, help="Run in development mode")
def web(debug):
    """Launch web interface."""
    app = create_app(config)
    if not debug:
        webbrowser.open(f"http://localhost:{config.PORT}")
    app.run(debug=debug, port=config.PORT)
