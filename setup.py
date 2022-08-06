import setuptools

setuptools.setup(
    name="ClipBin",
    entry_points={"console_scripts": ["clipbin=ClipBin.cli:cli"]},
)
