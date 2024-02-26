import pprint
import webbrowser

import click

from . import config, create_app


@click.group()
def cli():
    pass


@cli.command()
@click.option("-d", "--debug", is_flag=True)
def run(debug):
    app = create_app(config)
    if not debug:
        webbrowser.open(f"http://localhost:{config.PORT}")
    app.config.update({"ENV": "development" if debug else "production"})
    app.run(debug=debug, port=config.PORT)


@cli.command()
@click.argument("key")
@click.argument("value")
def set_config(key, value):
    config.set(key, value)

    click.secho(f"'{key}' set to '{value}'", fg="green")


@cli.command()
def get_config():
    click.secho(pprint.pformat(config.get()), fg="blue")
