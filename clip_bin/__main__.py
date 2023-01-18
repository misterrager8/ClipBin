import webbrowser
from pathlib import Path

import click
import dotenv
import pyperclip

from clip_bin import config, create_app
from clip_bin.models import Template


@click.group()
def cli():
    """ClipBin"""
    pass


@cli.command()
@click.option("--name", "-n", prompt=True, help="Name of your new template")
@click.option(
    "--file",
    "-f",
    type=click.Path(),
    help="File to copy content from to make new template (optional)",
)
def create_template(name, file):
    """Create a template."""
    template_ = Template(name)
    template_.create()

    if file:
        text_ = open(file).read()
        open(config.HOME_DIR / template_.name, "w").write(text_)

    click.secho("Template created.", fg="green")


@cli.command()
@click.option("--name", "-n", prompt=True, help="Name of template to delete")
def delete_template(name):
    """Delete a template."""
    template_ = Template(name)
    template_.delete()


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
@click.option("--key", "-k", prompt=True)
@click.option("--value", "-v", prompt=True)
def set_config(key, value):
    """Set a configuration option.
    Args:
        key (str): Name of the variable being set
        value (str): Value of the variable being set
    """
    dotenv.set_key(Path(__file__).parent.parent / ".env", key, value)
    click.secho(f"Config {key} set to {value}.", fg="green")


@cli.command()
@click.option("-d", "--debug", is_flag=True, help="Run in development mode")
def web(debug):
    """Launch web interface."""
    app = create_app(config)
    if not debug:
        webbrowser.open(f"http://localhost:{config.PORT}")
    app.run(debug=debug, port=config.PORT)
