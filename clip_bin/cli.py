import webbrowser

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
    with app.app_context():
        clips = Clip.query.all()
        click.secho("%s clip(s) found." % len(clips))
        for i in clips:
            click.secho("[%s] %s" % (i.id, i.name_), fg=config.CLI_COLOR)


@cli.command()
@click.option("--name", "-n", prompt=True)
@click.option("--file", "-f")
def add_clip(name, file):
    """Add a clip."""
    with app.app_context():
        Clip(name, content=open(file).read() if file else "").insert()
        click.secho("Clip added.", fg=config.CLI_COLOR)


@cli.command()
@click.option("--id", "-i", prompt=True, type=int)
def print_clip(id):
    """Print clip."""
    with app.app_context():
        clip_ = Clip.query.get(id)
        click.secho(clip_.content, fg=config.CLI_COLOR)


@cli.command()
@click.option("--id", "-i", prompt=True, type=int)
@click.option("--src", "-s", prompt=True)
def edit_clip(id, src):
    """Edit clip using content in SRC file."""
    with app.app_context():
        clip_ = Clip.query.get(id)
        with open(src) as f:
            clip_.content = f.read()

        clip_.edit()
        click.secho("Clip edited.", fg=config.CLI_COLOR)


@cli.command()
@click.option("--id", "-i", prompt=True, type=int)
def copy_clip(id):
    """Copy clip to clipboard."""
    with app.app_context():
        clip_ = Clip.query.get(id)
        pyperclip.copy(clip_.content)
        click.secho("Clip copied.", fg=config.CLI_COLOR)


@cli.command()
@click.option("--id", "-i", prompt=True, type=int)
@click.option("--name", "-n", prompt=True, type=str)
def save_clip(id, name):
    """Save clip to file."""
    with app.app_context():
        clip_ = Clip.query.get(id)
        open(name, "w").write(clip_.content)
        click.secho(f"Clip saved to {name}.", fg=config.CLI_COLOR)


@cli.command()
@click.option("--id", "-i", prompt=True, type=int)
def delete_clip(id):
    """Delete clip."""
    with app.app_context():
        clip_ = Clip.query.get(id)
        clip_.delete()
        click.secho("Clip deleted.", fg=config.CLI_COLOR)


@cli.command()
@click.option("--switch", "-s", is_flag=True)
def web(switch):
    """Launch web interface for ClipBin."""
    if switch:
        webbrowser.open(f"http://127.0.0.1:{config.PORT}/")
    app.run(port=config.PORT)
