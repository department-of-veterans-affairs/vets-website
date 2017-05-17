# Adding a collection of related links
_Added: 2017-04-27_

Our current publishing system, Metalsmith, provides a way to group related content using what it calls _collections_. Using collections requires the `metalsmith-collections` plugin ([documentation](https://github.com/segmentio/metalsmith-collections)).

Content grouped within a collection is displayed in the sidebar navigation, and the next/previous links. Next and previous links are set based on the sorting order (`sortBy` property of the collection; see below) 

Viewing `content/components/navigation-sidebar.html` and `content/components/navigation-next-previous.html` _may_ clarify some of what's in this document.

## Add a new collection

_**NOTE**: Content team, you may wish to file a request with the DevOps team for this task._

To create a new collection, add a new collection object to `vets-website/script/build.js`.


```
  smith.use(collections({
    collectionName: {
      pattern: 'path/to/the/files/*.md',
      sortBy: 'order',
      metadata: {
        name: 'Title for collection 1'
      }
    },
    secondCollectionName: {
      pattern: 'path/to/the/files/*.md',
      sortBy: 'order',
      metadata: {
        name: 'Title for collection two'
      }
    }
  }));
```

### What each field means:

- `collectionName`: should be a camel-cased or snake cased string that summarizes the name of the related documents.
- `pattern`: should be a directory a relative to the site root (without a leading slash), and end with `*.md` or `*.html` (`*` is a _wildcard_ character that will match every file with an `.md` or `*.html` extension.)
- `sortBy`: is any current YAML property used in the front matter metadata (front matter data is the stuff between the `---` at the beginning of each content file). This should be:

    - `order`
    - `title`
    - `display_title`

- `metadata`: must be a JavaScript object that contains a `name` property. This field is optional. You may add additional properties as here.

### Adding files to a collection even when it is not in the collection path

Collections can also be defined or augmented by adding a `collection` property to front matter fields. For example:

```
---
layout: page-breadcrumbs.html
title: Agent Orange
plainlanguage: 10-21-16 certified in compliance with the Plain Writing Act
template: detail-page
collection: disabilityExposureHazMat
---
```

In general you should:

- **Use a collection objects to configure collections.** Items within a collection directory will be added to the collection automatically
- **Add a collection property to include an index or other file** in the collection. For example, `exposure-to-hazardous-materials/agent-orange.md` is also an index page for several Agent Orange-related disability pages and should have a `disabilityExposureHazMat` property.

**NOTE:** Adding a `collection` property in YAML will not override a path-based collection value. You'll actually need to move the file. 

## Ordering pages within a collection

When defining a collection, you may choose to sort pages by date, or by title. In many cases, however, the desired page order may not use either of those fields. 

To control the order of display within a collection, add an `order` property to the front matter of each page.

The value of `order` should be a number. Pages will be ordered in ascending order.


## Adding a child collection

Collections do not have a hierarchy by default. Create one by adding a `children` property to the parent page or index page of a child collection.

```
---
layout: page-breadcrumbs.html
title: Agent Orange
plainlanguage: 10-21-16 certified in compliance with the Plain Writing Act
template: detail-page
collection: disabilityExposureHazMat
children: disabilityAgentOrange
order: 1
---
```

`children` should be the identifier for the child collection. 

## Current collections and hierarchy

_See vets-website/script/build.js_.

| Label | Path | Child collection(s) |
| --- | --- | --- |
| `disabilityExposureHazMat` | disability-benefits/conditions/exposure-to-hazardous-materials/*.md | `disabilityAgentOrange` |
| `disabilityAgentOrange` | disability-benefits/conditions/exposure-to-hazardous-materials/agent-orange/*.md | &ndash; |
| `education` | education/*.md | `educationGIBill` |
| `educationGIBill` | education/gi-bill/*.md | &ndash;

