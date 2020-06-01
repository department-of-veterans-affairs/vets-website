<!-- TODO: Add links -->

# A Brief Introduction

This book is for engineers building forms on VA.gov using the VA Forms Library.
We'll walk through the capabilities of the library systematically. By the end of
the book, you should have a solid grasp of how to build forms on VA.gov.

## A summary
[**Chapter 1: My First Form**](my-first-form.md) takes you step-by-step through
building your first form on VA.gov. It's intended for engineers new to the forms
library.

In [**Chapter 2: Customizing Your Form**](customizing-your-form.md), we
introduce you to the common options for your `formConfig`.

[**Chapter 3: Save in Progress and Pre-fill**](save-in-progress-and-prefill.md)
will teach you how to enable Save in Progress (SiP) and allow your applications
to be pre-filled with information the VA already has on file for a given
Veteran.

We give a laundry list of best practices in [**Chapter 4: Best
Practices**](best-practices.md). You may want to skim this one and refer back to
it later when you're building out your form.

In [**Chapter 5: Working with the `uiSchema`**](working-with-the-uischema.md),
we get into the details of how to adjust your form's UI configuration, which is
where the UI layout and logic is kept. We list the common options that you'll
probably find yourself using the most and call out some common quirks of the
library. This chapter isn't intended to be a comprehensive catalog of all the
things you can do with the library. For that, see the
[**Reference**](reference.md).

[**Chapter 6: Working with Arrays**](working-with-arrays.md) introduces the two
most common ways to store information in arrays in VA.gov forms.

[**Chapter 7: Validation**](validation.md) takes a quick foray into how
validation works in the Forms Library and how to write and use your own custom
validation functions.

Now that you know how to write a form, [**Chapter 8: Writing
Tests**](writing-tests.md) covers how to write the tests for them. We cover the
`DefinitionTester` for unit tests, and the automatic form tester for browser
testing.

Sometimes, you need something that the library doesn't provide by default.
[**Chapter 9: Writing Custom Fields and
Widgets**](writing-custom-fields-and-widgets.md) walks you through when and how
to create custom functionality for your data through custom fields and widgets.

After you've created your form and released it to the world, you may need to
make changes to it. In [**Chapter 10: Changing a Form in
Production**](changing-a-form-in-production.md), you'll learn about data
migrations and how to use them to preserve saved form data when you have to make
structural changes to the form.

Finally, we have the [**Reference**](reference.md) section. Here, we outline the
API for using the forms library. You can find anything from the default field
and widgets for the available schema `type`s, the `uiSchema` options available
to each field and widget, and all the `formConfig` options. Once you're familiar
with the library, this is the section you're most likely to come back to.

## How to read this book
If you're brand new to the VA Forms Library, we recommend reading the entire
first chapter and writing out the code yourself. From there, the book is
intended to be read sequentially all the way through, as we build on knowledge
gained in previous chapters, but once you have an understanding of the
fundamentals, you should be able to skip around to different chapters freely.

## Resources
- [json-schema.org](https://json-schema.org/learn/)
- [Understanding JSON Schema](https://spacetelescope.github.io/understanding-json-schema/)
- The _Forms Library Cookbook_
  - Learn by example to accomplish specific tasks
