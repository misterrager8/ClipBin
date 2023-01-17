#  ClipBin

![GitHub language count](https://img.shields.io/github/languages/count/misterrager8/ClipBin)
![GitHub top language](https://img.shields.io/github/languages/top/misterrager8/ClipBin)
![GitHub last commit](https://img.shields.io/github/last-commit/misterrager8/ClipBin)
![GitHub](https://img.shields.io/github/license/misterrager8/clipbin)

## About
Save important snippets (templates) of code or text that you commonly copy and paste. Locally-hosted and ran from your browser of choice. Files of any type can be stored in your home directory. Can also be used from the command-line for greater productivity.

## Screenshots

![](docs/screenshot1.png)

### Functionality

All templates are stored in the home directory of your choosing. ClipBin uses Jinja2 templating to generate strings with a list of variables to fill in the blanks. This allows you to use your snippets by just filling in the required variables (name, version, author, etc.), and a new file or string would be written to your clipboard or a new file. A list of all your templates and their associated variables are kept in the `templates.json` file of your home directory.

**Example**

    "README.md": [
        {
            "name": ""
        },
        {
            "description": ""
        },
        {
            "usage": ""
        },
        {
            "author": ""
        },
        {
            "license": ""
        }
    ]

### Usage

1. Clone this repo
2. Set configuration:
    1. Run `vi .env` in root of repo
    2. Set your `home_dir` setting (can be any local directory of your choice): `home_dir=[DIRECTORY]`
    3. Option configuration: `port` (defaults to 5000)
3. Run command `python3 setup.py develop` to install
4. Run command `clipbin --help` to see all options:

<!--  -->

    Usage: clipbin [OPTIONS] COMMAND [ARGS]...

    ClipBin

    Options:
      --help  Show this message and exit.

    Commands:
      copy2clipboard   Copy template to the clipboard.
      copy2file        Copy template to file.
      create-template  Create a template.
      delete-template  Delete a template.
      web              Launch web interface.

## Built With
- [click](https://github.com/pallets/click) - Command Line Interface Creation Kit
- [Flask](https://github.com/pallets/flask) - A micro web framework written in Python
- [Jinja2](https://github.com/pallets/jinja) - A modern and designer-friendly templating language for Python
- [pyperclip](https://github.com/asweigart/pyperclip) - A cross-platform clipboard module for Python
- [python-dotenv](https://github.com/theskumar/python-dotenv) - Add .env support to your django/flask apps
- [setuptools](https://github.com/pypa/setuptools) - A library that helps you build and distribute Python packages
- [pre-commit](https://github.com/pre-commit/pre-commit) - A framework for managing and maintaining multi-language pre-commit hooks

## Author
- **misterrager8** - [GitHub Profile](https://github.com/misterrager8)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
