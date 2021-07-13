# Formulate

Welcome to the VA.gov forms library!

## About the name

Before we get going, let's take care of some housekeeping: The name "Formulate"
is used to distinguish this library from its predecessor, but in public-facing
documentation talking about the forms library, use the plain language "forms
library" instead.

## Quick start

_Instructions for getting up and running go here._

## Documentation

When we write documentation, we'll put links to it here.

## Contributing

To use this library locally in a separate repo, we have to do some `npm link`ing
of the dependencies. Otherwise, the parent project _using_ the library will see
multiple versions of these dependencies and stuff will just sorta break.

Replace `../<project>` with the path to the project using Formulate:

```sh
npm link ../<project>/node_modules/formik ../<project>/node_modules/react
```

## The design document

For more information about the purpose and architecture of this library, check
out the [design document](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/platform/engineering/design-docs/2021-05-18-forms-library.md).

The design document is intended to be a living document, so if you find it
doesn't accurately reflect reality, please open an issue or submit a PR.
