# Welcome to the Demo Docs

This site hosts all the documentation on the demo project.

For full documentation on mkdocs visit [mkdocs.org](http://mkdocs.org).

## mkdocs Commands

* `mkdocs new [dir-name]` - Create a new project.
* `mkdocs serve` - Start the live-reloading docs server.
* `mkdocs build` - Build the documentation site.
* `mkdocs help` - Print this help message.

## Project layout

    mkdocs.yml    # The configuration file.
    docs/
        index.md  # The documentation homepage.
        ...       # Other markdown pages, images and other files.

## To Add a Page

    Add a markdown file to the docs folder and add to the pages
    configuration in `mkdocs.yml`.

    Format:
        - <Page Name>: '<source file for documentation>'
