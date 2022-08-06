import click
from ClipBin import config, create_app
from ClipBin.database import Database
from ClipBin.models import Clip
import pyperclip

app = create_app(config)
db = Database()


@click.group()
def cli():
    """ClipBin"""
    pass


@cli.command()
def list_all():
    """List all clips in the database."""
    clips = db.get_clips()
    click.secho("%s clip(s) found." % len(clips))
    for i in clips:
        click.secho("[%s] %s" % (i.id_, i.name_), fg="cyan")


@cli.command()
@click.argument("name")
def add_clip(name):
    """Add a clip."""
    db.add_clip(Clip(name))
    click.secho("Clip added.", fg="green")


@cli.command()
@click.argument("id")
def print_clip(id):
    """Print clip."""
    clip_ = db.get_clip(id)
    click.secho(clip_.content, fg="cyan")


@cli.command()
@click.argument("id")
@click.argument("src")
def edit_clip(id, src):
    """Edit clip using content in SRC file."""
    clip_ = db.get_clip(id)
    with open(src) as f:
        clip_.content = f.read()

    db.edit_clip(clip_)
    click.secho("Clip edited.", fg="green")


@cli.command()
@click.argument("id")
def copy_clip(id):
    """Copy clip to clipboard."""
    clip_ = db.get_clip(id)
    pyperclip.copy(clip_.content)
    click.secho("Clip copied.", fg="green")


@cli.command()
@click.argument("id")
def delete_clip(id):
    """Delete clip."""
    db.delete_clip(id)
    click.secho("Clip deleted.", fg="green")


@cli.command()
def web():
    """Launch web interface for ClipBin."""
    app.run()
