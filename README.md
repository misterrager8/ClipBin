# ClipBin
---

Save important snippets (templates) of code or text that you commonly copy and paste. Locally-hosted and ran from your browser of choice. Files of `.txt` type can be stored in your home directory. Can also be used from the command-line for greater productivity.

![](/docs/screenshot1.png)
![](/docs/screenshot2.png)

### Installation & Usage

1. Clone this repository
2. Run command `pip install -r requirements.txt` to install dependencies
3. Run command `python3 setup.py develop`
4. Make an `.env` file with the following environment variables:

<pre>
    home_dir=[HOME DIRECTORY]
    port=[Optional, '5000' by default]
</pre>

5. Run `clipbin web` to start web interface or `clipbin --help` for command-line options.

### Author

[C.N. Joseph (misterrager8)](https://github.com/misterrager8)

### License

ClipBin is released under the MIT License. See LICENSE for details.
