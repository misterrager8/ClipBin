import webbrowser

import click
import pyperclip

from clip_bin import config, create_app
from clip_bin.models import Template


@click.group()
def cli():
    """ClipBin"""
    pass


@cli.command()
def create_template():
    """Create a template."""
    pass


@cli.command()
def delete_template():
    """Delete a template."""
    pass


@cli.command()
@click.option(
    "-s",
    "--src",
    prompt="\n".join([i.name for i in Template.all()] + ["Source File"]),
    help="Source file to copy",
)
@click.option(
    "-d",
    "--dest",
    prompt=True,
    type=click.Path(),
    help="File to copy to (relative path)",
)
def copy2file(src, dest):
    """Copy template to file."""
    template_ = Template(src)
    input_ = []
    for i in template_.variables:
        x = click.prompt(i)
        input_.append(x)

    open(dest, "w").write(template_.format_text(input_))
    click.secho("Copied to file.", fg="green")


@cli.command()
@click.option(
    "-s",
    "--src",
    prompt="\n".join([i.name for i in Template.all()] + ["Source File"]),
    help="Source file to copy",
)
def copy2clipboard(src):
    """Copy template to the clipboard."""
    template_ = Template(src)
    input_ = []
    for i in template_.variables:
        x = click.prompt(i)
        input_.append(x)

    pyperclip.copy(template_.format_text(input_))
    click.secho("Copied to clipboard.", fg="green")


@cli.command()
@click.option("-d", "--debug", is_flag=True, help="Run in development mode")
def web(debug):
    """Launch web interface."""
    app = create_app(config)
    if not debug:
        webbrowser.open(f"http://localhost:{config.PORT}")
    app.run(debug=debug, port=config.PORT)
