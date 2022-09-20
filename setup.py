import setuptools

setuptools.setup(
    name="ClipBin",
    long_description=open("README.md").read(),
    license=open("LICENSE.md").read(),
    entry_points={"console_scripts": ["clipbin=clip_bin.cli:cli"]},
)
