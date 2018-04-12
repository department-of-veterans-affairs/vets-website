# vets.gov CSS/SCSS Best Practices (Draft)

(_Created: April 28, 2017_)
_Last Updated: May 3, 2017_


## Overview

This is high-level view of the current (S)CSS architecture, and a set of guidelines for writing scalable, maintainable, performant CSS and SCSS.

## Background

As Vets.gov has grown to encompass more features and products, our CSS has grown with it. The beta version of the site used the Foundation CSS framework, with custom CSS added as needed. Subsequent versions of the site shifted to the [United States Web Design Standards](https://standards.usa.gov) (USWDS) framework. 

Portions of the site still use the Foundation grid. Newer templates use the USWDS grid. Most of the site's components use VA-specific CSS.

## Current dependencies

Vets.gov uses Sass as its preprocessor with SCSS syntax.

- USWDS 0.10.0
    - normalize.css
    - Bourbon 
    - Neat
- Foundation (deprecated; please do not use)
- FontAwesome

## Browser support

Current browser [support chart](https://github.com/department-of-veterans-affairs/vets.gov-team/blob/master/Work%20Practices/Engineering/DocumentedDecisions/Browser%20Support.md).

## File organization

Yes, the current CSS file structure is a mess and a bit counterintuitive. It's a legacy of our rapid growth, lots of developers, and a huge restructuring as we moved from Jekyll to Metalsmith.

Partials should begin with an `_` so that Sass won't compile them separately into CSS files.

- There are two main SCSS files:
    - **`style.scss`**: Contains partials common to React-based products and non-React pages. Includes links to:
        - USWDS
            -  normalize.css
            -  Bourbon and Neat
        - FontAwesome
        - Foundation
    - **`static-pages.scss`**: Contains partials used exclusively for non-React pages. It also imports `style.scss`.
- Each React product also has a corresponding SCSS file.
- **`_shame.scss`** should be used to override / augment USWDS, normalize, or Font Awesome styles, and terrible CSS you added to make something work.
- Site-wide/non-product partials are grouped into `base`, `modules`, and `layouts`.
    - `base` includes variables, utilities classes, mixin, and function definitions. 
    - `modules` includes CSS for particular patterns and components.
    - `layouts` is _intended_ to includes layout partials, but does not as of yet.

`base` also includes `_va.scss` which is (unfortunately) a bit of a legacy catch-all file.

## Guidelines for good SCSS / CSS

Some guidelines for writing good CSS that scales well and doesn't make your colleagues ragey.

### Use low-specificity selectors

The more specific the selector is, the less reusable the accompanying CSS is and/or the longer a selector you need to override it. (Or you add `!important` in places you shouldn't.) 

The following should be used sparingly in CSS

  - `id` selectors.
  - Complex element/type selectors with attributes such as `button[type=button]` and `input[type=text]`.
  - Descendant combinators such as `#main ol li ul` or `.process p a`.
  - Chaining class names. `button` and `button.lg`)

High specificity selectors are more likely to create side effects, that have to be undone with more CSS rules or longer selectors.

### Avoid nesting SCSS selectors prematurely

SCSS compiles nested selectors into descendant combinators. For example:

    #content {
      ol {
        p {}
      }
    }


Compiles to: 

    #content ol p {}

There's a high likelihood, however that your selectors don't need to be that long; `ol p` would provide the same styling. If the worry is being overly broad, you can get the same results using a class name. This is related to the previous point. Specific selectors are often caused by SCSS nesting. 


Nesting selectors can be useful, however, when creating variants. For example:

    .button {
      &-link {
      }
    }

Compiles to `button-link`.


### Restrict class names to a single pattern or component type. 

For example, don't use `.process` for lists _and_ as a `div` or `section` type. Rules you introduce for `div.process` probably aren't related to those for `ol.process`. Instead use `.list-process` and `.section-process`. 

### Favor descriptive class names that describe what the class does or the kind of content it affects

Class names such as `.primary`, or `.section` are confusing and more likely to be misused by a colleague than `.intro-text` or `.sidebar`. 

### Use a product-specific prefix to avoid class name collisions

This keeps selector specificity low, while also restricting the side-effects of any one selector.

### Don't use `@extend`

SCSS `@extend` repeats every instance of the extended selector for the extendee selector. (This will be flagged by our Sass-lint configuration.)

    h4 {
      color: #c09;
      font-size: 1.2rem;
      font-weight: 100;
    }
    
    label {
      @extend h4;
      cursor: pointer;
    }

    .footer h4 {
      display: inline;
    }

Compiles to: 

    h4, label {
      color: #c09;
      font-size: 1.2rem;
      font-weight: 100; }
    
    label {
      cursor: pointer; }
    
    .header h4, .header label {
      font-weight: bold; }
    
    .footer h4, .footer label {
      display: inline; }

Every instance of `h4` will also be applied to `label`. This is usually not the behavior we want, particularly across an entire code base. 


## CHECK. YOUR. OUTPUT.

Periodially check your generated CSS files (JavaScript too!) to ensure that you didn't introduce bloat with your selectors or asset imports. 

True story: we reduced the size of our home page CSS by ~400K by removing SVG fonts. Our Webpack configuration included base64-encoded versions of SVG fonts which dramatically inflated our file size. This fact was discovered only after viewing the generated CSS files.
