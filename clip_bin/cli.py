import click
import pyperclip

from clip_bin import config, create_app
from clip_bin.models import Clip

app = create_app(config)


@click.group()
def cli():
    """ClipBin"""
    pass


@cli.command()
def list_all():
    """List all clips in the database."""
    clips = Clip.all()
    click.secho("%s clip(s) found." % len(clips))
    for i in clips:
        click.secho("[%s] %s" % (i.id_, i.name_), fg=config.CLI_COLOR)


@cli.command()
@click.option("--name", "-n", prompt=True)
@click.option("--file", "-f")
def add_clip(name, file):
    """Add a clip."""
    Clip(name, content=open(file).read() if file else "").insert()
    click.secho("Clip added.", fg=config.CLI_COLOR)


@cli.command()
@click.option("--id", "-i", prompt=True, type=int)
def print_clip(id):
    """Print clip."""
    clip_ = Clip.get(id)
    click.secho(clip_.content, fg=config.CLI_COLOR)


@cli.command()
@click.option("--id", "-i", prompt=True, type=int)
@click.option("--src", "-s", prompt=True)
def edit_clip(id, src):
    """Edit clip using content in SRC file."""
    clip_ = Clip.get(id)
    with open(src) as f:
        clip_.content = f.read()

    clip_.edit()
    click.secho("Clip edited.", fg=config.CLI_COLOR)


@cli.command()
@click.option("--id", "-i", prompt=True, type=int)
def copy_clip(id):
    """Copy clip to clipboard."""
    clip_ = Clip.get(id)
    pyperclip.copy(clip_.content)
    click.secho("Clip copied.", fg=config.CLI_COLOR)


@cli.command()
@click.option("--id", "-i", prompt=True, type=int)
@click.option("--name", "-n", prompt=True, type=str)
def save_clip(id, name):
    """Save clip to file."""
    clip_ = Clip.get(id)
    open(name, "w").write(clip_.content)
    click.secho(f"Clip saved to {name}.", fg=config.CLI_COLOR)


@cli.command()
@click.option("--id", "-i", prompt=True, type=int)
def delete_clip(id):
    """Delete clip."""
    clip_ = Clip.get(id)
    clip_.delete()
    click.secho("Clip deleted.", fg=config.CLI_COLOR)


@cli.command()
def web():
    """Launch web interface for ClipBin."""
    app.run()
