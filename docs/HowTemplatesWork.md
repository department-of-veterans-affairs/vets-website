# How templates work

- Created: 23 March 2017
- Last updated: 23 March 2017

Templates use [tinyliquid](https://github.com/leizongmin/tinyliquid/), a JavaScript implementation of [Liquid](https://liquidmarkup.org).

There are three "wrapper" templates currently in use. They're all in `content/layouts/`.

- `page-react`: Houses our React pages.
- `page-breadcrumbs`: Houses our non-React content pages.
- `page-playbook`: Houses Playbook pages.

`page-breadcrumbs` is a container template that loads layouts for the content between the header and the footer. Those are in `content/layouts/includes/`. 

Templates are loaded based on the value of the `template` property in the YAML/front-page data of each content file -- the text between the `---`. Content files can be found in `content/pages/`.

## Adding a new template

- Add a new HTML + Liquid template file to `content/includes`
- Update `page-breadcrumbs` with a new case for the new layout.
- Update the `template` property for whichever pages should load the new template.
