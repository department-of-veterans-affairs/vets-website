# Updating Your Form

Now that you're up and running, we can add a new page and field to our form. If
you open up `src/applications/new-form/config.js`, you should see a `formConfig`
variable:

```js
const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'new-form-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'XX-230',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for new form benefits.',
    noAuth:
      'Please sign in again to continue your application for new form benefits.'
  },
  title: 'My new form',
  defaultDefinitions: {
  },
  chapters: {
    chapter1: {
      title: 'Chapter 1',
      pages: {
        page1: {
          path: 'first-page',
          title: 'First Page',
          uiSchema: {
          },
          schema: {
            type: 'object',
            properties: {
            },
          },
        },
      },
    },
  },
};
```

There's a lot of information already there! We'll cover what all those
properties mean in [Chapter 2: Customizing Your Form](customizing-your-form.md).
For now, we're going to look at the content of the form, which
lives in `chapters`.

At the most basic level, our forms consist of widgets, fields, pages, and
chapters.

- **Widgets** are the basic form controls, things like `<input/>` and
  `<select/>` elements.
- **Fields** are the next level up and contain a widget and a `<label/>`, plus
  some extra optional description information.
- We then have **pages**, which are collections of fields.
- **Chapters** are collections of pages.

We can see in the config that there's already one chapter, with one page inside
it, called `page1`. In the `page1` object, there are a few pieces of information,
which we can mostly ignore for now. To learn more about the available page
options, see [Page Options](page-options.md) in the Reference chapter.

The important properties for us right now are `uiSchema` and `schema`. `schema`
is the initial structure of our page, in the form of a [JSON
Schema](https://spacetelescope.github.io/understanding-json-schema/). This
describes the type of data that will result from a user filling in our form.
It's also used by the form library to determine what fields and widgets to
display in the application, except when overridden by `uiSchema`. `uiSchema` is
an object that has extra, user interface-focused information to help render the
form.

Let's add a property to `schema`:

```js
page1: {
  path: 'first-page',
  title: 'First Page',
  uiSchema: {
  },
  schema: {
    type: 'object',
    properties: {
      myField: {
        type: 'string'
      }
    }
  }
}
```

Now if you go to http://localhost:3001/new-form/first-page you should see this:

<!-- ![](../../images/forms/first-field.png) -->
<!-- TODO: Add a screenshot -->

That's not the most exciting field, but it's a field! We can add a title to it
by adding to `uiSchema`:

```js
page1: {
  path: 'first-page',
  title: 'First Page',
  uiSchema: {
    myField: {
      'ui:title': 'My field label'
    }
  },
  schema: {
    type: 'object',
    properties: {
      myField: {
        type: 'string'
      }
    }
  }
}
```

That makes it look a little more presentable:

<!-- ![](../../images/forms/field-with-label.png) -->
<!-- TODO: Add a screenshot -->

Note that `uiSchema` doesn't follow exactly the same structure as `schema`: you
don't need the `properties` object. This is because `uiSchema` treats everything
without a `ui:` prefix as a field name, with one exception for array fields.

<!-- TODO: Clarify the above; it's not exactly true -->

Changing the the `type` property in your field will change the data accepted and
also the way it displays on the form. You can change it to be `boolean` and get
a checkbox and `number` to get a number input. If you want a `select` box, you
use JSON Schema's `enum` property:

```js
page1: {
  path: 'first-page',
  title: 'First Page',
  uiSchema: {
    myField: {
      'ui:title': 'My field label'
    }
  },
  schema: {
    type: 'object',
    properties: {
      myField: {
        type: 'string',
        'enum': [
          'First option',
          'Second option'
        ]
      }
    }
  }
}
```

That will get you a select box with options we gave it in the `enum` property.

<!-- ![](../../images/forms/select-field.png) -->
<!-- TODO: Add a screenshot -->

Some types of data might have different valid ways of asking the user for input.
For example, a field that uses `enum` could also use radio buttons. You can
change that with `ui:widget`:

```js
page1: {
  path: 'first-page',
  title: 'First Page',
  uiSchema: {
    myField: {
      'ui:title': 'My field label',
      'ui:widget': 'radio'
    }
  },
  schema: {
    type: 'object',
    properties: {
      myField: {
        type: 'string',
        'enum': [
          'First option',
          'Second option'
        ]
      }
    }
  }
}
```

Now the form offers two radio buttons to choose from.

<!-- ![](../../images/forms/radio-buttons.png) -->
<!-- TODO: Add a screenshot -->

You can also mark fields as required, which will prevent you from moving to the
next page without filling them out:

```js
page1: {
  path: 'first-page',
  title: 'First Page',
  uiSchema: {
    myField: {
      'ui:title': 'My field label',
      'ui:widget': 'radio'
    }
  },
  schema: {
    type: 'object',
    required: ['myField'],
    properties: {
      myField: {
        type: 'string',
        'enum': [
          'First option',
          'Second option'
        ]
      }
    }
  }
}
```

If you do fill in the required information and click Continue, you'll end up on
the review page. The review page for our forms is generated based on your
chapters and pages and provides a quick way to review the data that you've
entered:

<!-- ![](../../images/forms/review.png) -->
<!-- TODO: Add a screenshot -->

Note that if you refresh in the middle of the form, your data will be lost and
the review page won't have any content to edit. In [Chapter 3: Save in Progress
and Pre-fill](save-in-progress-and-prefill.md), we'll talk about how to save the
form data as the user is filling it out to prevent this kind of data loss.

Once you've reviewed your form, you have to click the checkbox to agree to the
privacy policy and then you can submit! For now, though, that Submit button will
fail because there's no API to submit the data to.

That's it! _Now_ you've made your first real form using the VA Forms Library.
Congratulations!

If you want to learn more about a specific part of building forms, feel free to
jump to the chapter in the Table of Contents on the left.
