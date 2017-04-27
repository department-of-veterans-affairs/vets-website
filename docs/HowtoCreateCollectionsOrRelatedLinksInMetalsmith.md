# Adding a collection of related links
_Added: 2017-04-27_

_**A longer version of this piece, geared towards content writers, is available in the content team's repository**_.

Our current publishing system, Metalsmith, provides a way to group related content using what it calls _collections_. Using collections requires the `metalsmith-collections` plugin ([documentation](https://github.com/segmentio/metalsmith-collections)).

Content grouped within a collection is displayed in the sidebar navigation. Viewing `content/components/navigation-sidebar.html` may clarify some of what's in this document.

## Add a new collection

To create a new collection, add a new collection object to `vets-website/script/build.js`.

```
smith.use(collections({
  collectionName: {
    path: 'path/to/the/files/*.md',
    sortBy: 'order',
    metadata: {
      name: 'Title for collection 1'
    }
  },
  secondCollectionName: {
    path: 'path/to/the/files/*.md',
    sortBy: 'order',
    metadata: {
      name: 'Title for collection two'
    }
  }
}));
```

### What each field means:

- `collectionName`: should be a camel-cased or snake-cased (e.g. snake_cased, with an underscore) string that summarizes the name of the related documents.
- `path`: should be a relative directory path to the markdown files to be grouped.
- `sortBy`: is any current YAML property used in the front matter metadata (front matter data is the stuff between the `---` at the beginning of each content file). This should usually be:

    - `order`
    - `title` 
    - `display_title`
    - `date` (default value).

- `metadata`: must be a JavaScript object that contains a `name` property. This field is optional. `metadata` may include other properties.

### Adding files to a collection even when it is not in the collection path

Collections can also be defined or augmented by adding a `collection` property to front matter fields. For example:

```
---
layout: page-breadcrumbs.html
title: Agent Orange
plainlanguage: 10-21-16 certified in compliance with the Plain Writing Act
template: detail-page
collection: exposureHazMat
---
```

