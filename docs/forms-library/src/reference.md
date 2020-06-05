# Reference

In this chapter, you'll find an exhaustive list of all options available in the
forms library. If you find an option that isn't captured in this reference, please let
us know or submit a PR to add the documentation!

<!-- TODO: Add a link for how to let us know -->
<!-- TODO: Link to the documentation repo to make it easier to submit a PR -->

By this point, we assume you're already comfortable using the library and are
coming here to find the exact API for the feature you're using.

**If you already know what you're looking for,** you can navigate to the section
directly.

**If you're not sure where to find the configuration option you're looking
for,** understanding what you're configuring will help. Configuration options
are available at
- The `formConfig` level
  - See [**Customizing Your Form**](./customizing-your-form.md) for more information.
  - [**`formConfig` Options**](./formconfig-options.md) contains the full list
    of options available.
- The [Chapter level](./chapter-options.md)
- The [Page level](./page-options.md)
- The input field level
  - `uiSchema` options are used at this level

`uiSchema` options may be used by:
- The [`ui:field`](./available-uifields.md) component
- The [`ui:widget`](./available-uiwidgets.md) component
- [Helper functions](./other-uischema-options.md) that live outside both
  `ui:field` and `ui:widget`.

The forms library will determine the `ui:field` and `ui:widget` components in
one of two ways. It will either use:
- The `uiSchema`'s `ui:field` and `ui:widget`, or
- The default `ui:field` and `ui:widget` for the [**schema
    type**](schema-types.md)

## What each reference section contains
The first section, [**Schema Types**](schema-types.md) contains—you guessed it—a
**list of available types** for your schema. You'll also find the **default
fields and widgets** used for each type as well as **alternative widgets**
designed for them.

[**Available `ui:field`s**](available-uifields.md) provides a list of all fields and
all `uiSchema` options they use.

Similarly, [**Available `ui:widget`s**](./available-uiwidgets.md) provides a list of
all widgets and all `uiSchema` options they use.

[**`formConfig` Options**](./formconfig-options.md) covers all the options available
at the root `formConfig` level, such as the `urlPrefix` and `submitUrl`.

[**Page Options**](./page-options.md) lists all options available for every page,
such as `schema`, `uiSchema`, and `arrayPath`.
