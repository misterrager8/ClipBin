import setuptools

setuptools.setup(
    name="clipbin",
    version="2024.02.26",
    long_description=open("README.md").read(),
    license=open("LICENSE.md").read(),
    entry_points={"console_scripts": ["clipbin=clipbin.__main__:cli"]},
)
