# Conventions

Conventions used in the vets-website code.

## Naming conventions

1. For form applications, we are using the following names to reference the hierarchy of elements:

`chapter` > `page` > `block`

  - `chapter`: refers to the highest level grouping of questions. `chapter`s will not typically have a markdown page of their own, but will instead be comprised of several `page`s. E.g., `Veteran Information`.
  - `page`: refers to an individual page of questions. `page`s live within a given `chapter`. E.g., `Demographic Information` page lives within the `Veteran Information` chapter.
  - `block`: refers to a subset of questions within a `page`. E.g., since there can be more than one child, there is a component just for the questions that apply to an individual child, which is rendered as many times as there are children.
  
