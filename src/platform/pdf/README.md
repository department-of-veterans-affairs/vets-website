
# Accessible PDF Generation

This package provides an API and templates for generating accessible PDFs on the client side.

## Installation

`yarn workspace @department-of-veterans-affairs/platform-pdf install`

## Testing changes

`yarn --cwd $( git rev-parse --show-toplevel ) watch --env entry=pdf,pre-check-in`

## Usage

### PDF Metadata

The following fields must be provided by the caller in the JSON data:

* Title

The following fields should be provided, but are not required:

* Author (defaults to "Department of Veterans Affairs")
* Language (defaults to "en-US")
* Subject (defaults to blank)
