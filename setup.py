import setuptools

setuptools.setup(
    name="ClipBin",
    version="3.1.0",
    long_description=open("README.md").read(),
    license=open("LICENSE.md").read(),
    entry_points={"console_scripts": ["clipbin=clip_bin.__main__:cli"]},
)
