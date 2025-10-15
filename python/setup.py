from setuptools import setup, find_packages

setup(
    name="nexa-sdk-python",
    version="1.0.0",
    description="Python SDK for Nexa Languages API",
    author="Your Name",
    author_email="you@example.com",
    url="https://github.com/yourusername/nexa-sdk",
    packages=find_packages(),  # discovers 'sdk' at python/sdk
    install_requires=[
        "requests>=2.31.0",
    ],
    python_requires=">=3.8",
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
)
