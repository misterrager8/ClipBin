# ClipBin
---
![GitHub language count](https://img.shields.io/github/languages/count/misterrager8/ClipBin)
![GitHub top language](https://img.shields.io/github/languages/top/misterrager8/ClipBin)
![GitHub last commit](https://img.shields.io/github/last-commit/misterrager8/ClipBin)
![GitHub](https://img.shields.io/github/license/misterrager8/clipbin)

Simple and intuitive code snippet and clipboard manager. It will save any text or code snippet in a MySQL database, allowing you to access it later. Comes with both a command-line and web-based interface, powered by Flask. You can also save file contents straight into a copyable snippet for convenience. Lightweight and barebones app for developers like me, who like to make their own macros and code snippets for frequent use.

## Usage

1. Clone this repository
2. Run command: `python3 setup.py develop` to install app and its dependencies
3. Once installed, run `clipbin --help` command for the help message and options:

<!---->

    Usage: clipbin [OPTIONS] COMMAND [ARGS]...

      ClipBin

    Options:
      --help  Show this message and exit.

    Commands:
      add-clip     Add a clip.
      copy-clip    Copy clip to clipboard.
      delete-clip  Delete clip.
      edit-clip    Edit clip using content in SRC file.
      list-all     List all clips in the database.
      print-clip   Print clip.
      save-clip    Save clip to file.
      web          Launch web interface for ClipBin.

## Example

    > clipbin list-all

    [35] Count Lines Of Code
    [34] models.py
    [33] .pre-commit-config.yaml
    [25] beautifulsoup
    [24] flask blueprints
    [23] EasyMDE.js editor
    [22] LICENSE.md
    [21] __init__.py
    [20] views.py
    [19] main.css
    [18] main.js
    [17] index.html
    [16] base.html
    [15] config.py
    [13] README.md
    [10] setup.py
    [8] cli.py
    [6] flask crud fns
    [5] flask login
    [2] random color in python
