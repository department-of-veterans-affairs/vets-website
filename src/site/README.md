# Guide to templates

## The content build
The _content build_ refers to the process used to generate VA.gov as a static website. From the root of the project, a terminal command is issued that will execute a script file in this project. After a series of steps - some steps longer than others - that process will output into the `project-root/build` directory a new directory containing all of the VA.gov static assets, including HTML pages, JavaScript, CSS, images, etc. During a front-end _deployment_, this new directory is compressed into an "archive" and then uploaded onto our host to become VA.gov.

One of the steps during the content build process is to process each set of page data through a corresponding template in order to produce HTML from structured content.

## Introduction to templates
_Templates_ are files composed of HTML and some programming directives used to process a data structure representing structured content into a final HTML page.

### How templating works with Markdown files
After setting up the project, the `vagov-content` repo should be a sibling repo to `vets-website`. `vagov-content` contains static content files in the form of Markdown (`.md`) in the `vagov-content/pages` directory. At the top of each Markdown file, there are declarations of key-value pairs referred to as "frontmatter", which are often used to define metadata about the page or to describe how the page should be processed during the HTML compilation.

The most common key in frontmatter is a `layout` property, which refers to a file in `vets-website/src/site/layouts`. For example, this [`layout`](https://github.com/department-of-veterans-affairs/vagov-content/blame/68a9ca3d87214bee2e14a95f54044cd5c7d19f5a/pages/coronavirus-chatbot.md#L3) property refers to this [layout file](https://github.com/department-of-veterans-affairs/vets-website/blob/6c61531163be7b52345b6096dc6a76fc38e7776e/src/site/layouts/page-breadcrumbs.html) in `vets-website`. The frontmatter of the `.md` file are passed to the layout file as the global scope.

<details>

<summary>Example of a Markdown file processed throughout a layout file</summary>

For example, pretend this is a `.md` file in `vagov-content.`

```markdown
---
layout: favorite-movies.html
movies:
  - Ace Ventura
  - Disney Cars
  - Toy Story
---

I love movies! Here are some of my recommendations.
```

The `layout` property would refer to a layout file `vets-website/src/site/layouts/favorite-movies.html`, which could look like -

```
<p>{{ contents }}</p>
<ul>
{% for movie in movies %}
  <li>{{ movie }}</li>
{% endfor %}
</ul>
```

This templating language is called [Liquid](https://shopify.github.io/liquid/). The body of the Markdown file (which resides below the frontmatter of the page and may contain HTML) will be available to the template in a `contents` property. This would result in the following HTML snippet.

```html
<p>I love movies! Here are some of my recommendations.</p>
<ul>
  <li>Ace Ventura</li>
  <li>Disney Cars</li>
  <li>Toy Story</li>
</ul>
```

</details>

### How templating works with CMS data
During a content build, your project will issue a network request to fetch data from the VA CMS, Drupal. Afterwards, the response JSON should be cached locally at `vets-website/.cache/localhost/drupal/pages.json`. To refresh the content, run `yarn build:content --pull-drupal`. The `vets-website/.cache` directory will be emptied and a new network request will be issued.

The JSON file returned by the CMS will be parsed into separate pages during the `vets-website` compilation process. Consider opening the `vets-website/.cache/localhost/drupal/pages.json` file to explore the data structures.

<details>

<summary>Example of a Drupal entity processed throughout a layout file</summary>

```json
{
  "entityBundle": "landing_page",
  "entityId": "79",
  "entityPublished": true,
  "title": "VA records",
  "entityUrl": {
    "breadcrumb": [
      {
        "url": {
          "path": "/",
          "routed": true
        },
        "text": "Home"
      },
      {
        "url": {
          "path": "",
          "routed": true
        },
        "text": "Records"
      }
    ],
    "path": "/records"
  },
  "fieldIntroText": "Access your VA records and documents online to more easily manage your benefits."
}
```

Whereas Markdown files contain a clear `layout` declaration in frontmatter, the `entityBundle` is used to form the relationship between a CMS data structure to a layout. The `entityBundle` can be considered a type of CMS "node" represented by this data structure. Layouts used solely by CMS data structures have a unique file extension - `.drupal.liquid`. In this example, the layout file would be `vets-website/src/site/layouts/landing_page.drupal.liquid`.

```
<h1>{{ title }}</h1>
<p>{{ fieldIntroText }}</p>
```

This layout would result in this HTML snippet -

```html
<title>VA records</title>
<p>Access your VA records and documents online to more easily manage your benefits.</p>
```

The `entityUrl.path` property is used to determine the page's path on the website. This example would be visible at `/records/`.

</details>

### Debugging

<details>

<summary>Console output</summary>

While running your website locally, open the console panel of your browser's developer tools. Visit `/health-care` and observe the following output.

![console output of Drupal data](../../docs/images/cms-data-console.png)

This data structure represents the data structure that was processed throughout the layout file during the website compilation.
</details>

<details>

<summary>DOM attributes</summary>
To further demystify the dynamic nature of the templating process, a pattern of the project is to use `data-` attributes to describe various templates. For example, observe the various `data-template` properties in the following DOM.

![data attributes describing the templating process](../../docs/images/cms-data-attributes.png)

There is also an HTML comment at the top of the file to help describe the current page.

![HTML comment describing the page](../../docs/images/cms-html-comment.png)

</details>

### Resources

The implementation of the Liquid templating language used by our project is [TinyLiquid](https://github.com/leizongmin/tinyliquid). We highly recommend using [TinyLiquid's README](https://github.com/leizongmin/tinyliquid/blob/cebcb26c3839e725cf0469dccc0073799902a020/README_en.md) as your resource while writing a template, as there are small [differences from Shopify's language spec](https://github.com/leizongmin/tinyliquid#the-difference-with-liquid-language).

## Setting up a new template
If you are tasked with writing a new template, you will more than likely be working with a new type of page from the CMS. At a high level, you will first write the GraphQL query for the new type of page, register it into the build, then begin the process of templating. Here's an in-depth list of steps recommended to help make this easier.

<details><summary>1. Determine the value of the "entityBundle" belonging to the new type of page
</summary>

This new type of page will have a unique value for its top-level `entityBundle`. As described in previous sections, this value will be used to form the relationship between the CMS data structure and the template. Thus, determining this value and using it to learn about your data structure is the first part of getting started.

The simplest way of getting your page's `entityBundle` is by leveraging the usual avenues on Slack to connect with the CMS team (primarily the `#cms-support` channel) or by simply asking your supporting CMS engineer what the value is. This value can be considered the "hand-off" to the front-end team so that templating can begin.

</details>

<details>

<summary>2. Write the GraphQL query</summary>

The CMS provides a tool called the [GraphQL Explorer](https://prod.cms.va.gov/graphql/explorer) to help write and debug GraphQL queries. You may be familiar with this tool from other GraphQL servers. You can leverage the value of the `entityBundle` determined in the former step to get started writing your query. If you are not familiar with GraphQL queries, the GraphQL website provides fantastic [documentation](https://graphql.org/learn/queries/) we recommend reading.

A GraphQL query for retrieving pages will consist of a `nodeQuery` with a `filter` applied to narrow down results to only nodes belonging to a certain `entityBundle`. Consider this GraphQL snippet used for getting all pages of type `landing_page`. In this example, `landing_page` is the value of the `entityBundle`.

```graphql
{
  nodeQuery(limit: 1, filter: {conditions: [{field: "type", value: ["landing_page"]}]}) {
    entities {
      ... on NodeLandingPage {
        entityId
      	entityBundle
      	entityUrl {
          path
        }    
        title
        fieldIntroText
      }
    }
  }
}
```

The response JSON for this GraphQL query will contain a single instance of the page-type `landing_page`. Here is the response JSON as of writing.

```json
{
  "data": {
    "nodeQuery": {
      "entities": [
        {
          "entityId": "79",
          "entityBundle": "landing_page",
           "entityUrl": {
              "path": "/records"
           },           
          "title": "VA records",
          "fieldIntroText": "Access your VA records and documents online to more easily manage your benefits."
        }
      ]
    }
  }
}
```

Every page-level query _must_ include the following fields:

- **entityId**: used for troubleshooting and, in some cases, connecting to React components on the page
- **entityBundle**: used by the build system to determine which template to use when rendering the page
- **entityUrl**: used by the build system to determine the path of generated static HTML file

Your complete query will be restructured so that your JS module exports a GraphQL fragment for use in the preview server as well as a standalone `nodeQuery` for use in the content build. It should also contain an additional `filter` - a boolean field called `status` that is used to toggle only draft vs. published content. Here is a complete example of what your module may look like. _Note - Hopefully, soon the preview server will be updated to use the same query as the content build. This doc wil be updated once that happens._

```js
const examplePageFragment = `
  fragment examplePageFragment on NodeLandingPage {
    entityId
    entityBundle
    entityUrl {
      path
    }     
    title
    fieldIntroText
  }
`;

const GetExamplePages = `
  ${examplePageFragment}

  query GetExamplePages($onlyPublishedContent: Boolean!) {
    nodeQuery(limit: 100, filter: {
      conditions: [
        { field: "status", value: ["1"], enabled: $onlyPublishedContent },
        { field: "type", value: ["landing_page"] }
      ]
    }) {
      entities {
        ... examplePageFragment
      }
    }
  }
`;

module.exports = {
  fragment: examplePageFragment,
  GetExamplePages
};
```

</details>

<details><summary>3. Register your GraphQL query into the content build</summary>

As of writing, the module located at `src/site/stages/build/drupal/individual-queries.js` contains a list of node queries that each executed during a content build. Follow the pattern in that file to add your module's GraphQL query into that list. Once done, a `yarn build:content --pull-drupal` should include your GraphQL query. If you try this now it will probably have no effect because there are probably no published pages of the new page-type.

</details>

<details><summary>4. Register your GraphQL fragment into the preview server</summary>

As of writing, there is a module located at `src/site/stages/build/drupal/graphql/GetLatestPageById.graphql.js` that contains the GraphQL query issued by the preview server when a user navigates to the route `/preview?nodeId=${nodeId}`. It is a monolithic query that includes all of the fragments describing page-types. Follow the pattern in that file to add your module's GraphQL fragment into the `GetLatestPageById` GraphQL query.

</details>

<details>
<summary>5. Create the new layout file</summary>

Create the layout file at `src/site/layouts/${YOUR_UNIQUE_ENTITY_BUNDLE}.drupal.liquid`. Add the standard website components by copying the various `includes` from another layout file into yours. Specifically, make sure to include `src/site/includes/debug.drupal.liquid`, which is very useful when writing and debugging templates.

</details>

<details><summary>6. Follow steps below for editing templates</summary>
At this point, you are all done setting up the new template - the relationship between the page-type in the CMS and the layout file in this project should be complete. Now you should be able to write your template the same way you would edit a pre-existing one using the preview server.

</details>

## Editing templates
When editing a template, you can choose between two workflows - via the application server or the preview server. The application server is preferred when you are making changes to the application code that powers static content, whereas the preview server is preferred when you are making heavy template changes.

<details><summary>Edit using the application server</summary>

This approach is recommended when you are more interested in making changes to application code (almost certainly the JavaScript and CSS files of the `static-pages` application, which will be presumed going forward) so you are already running a server via Webpack but occasionally you need to rebuild the HTML files. This way, your edits to the `static-pages` JavaScript and CSS will have the benefits of hot reload. Template edits will be reflected in HTML pages via occasional content builds.

_Note: This is probably not an option at all if you are working a new template, because it is unlikely that there are any instances of the page that are actually published, and a content build only includes published pages._

Here is an example workflow -

1. Refresh your local CMS data by first doing a `yarn build:content --pull-drupal`. Only use the `--pull-drupal` flag when you first begin, because after that point you will likely already have the CMS page data you are interested in.
1. Start your application server via `yarn watch --env.entry=static-pages`
    - _Note: the `static-pages` application contains the JavaScript and CSS code that powers plain content (AKA "static pages", which includes all of the HTML pages generated by the templates.) This means that if you need to edit the CSS for a template, you will do so via the `static-pages` application._
1. Edits to the `static-pages` application code will refresh via hot reload
1. After editing a template, issue a `yarn build:content` in a separate terminal so as not to disrupt your application server

_Note: you may have noticed that the project also has a `yarn watch:content` task available. At the time of writing, this task has appeared to be unstable. For example, if you make multiple edits to a template file and save after edit before the former content builds have a chance to complete, your watch task may crash._

</details>

<details><summary>Edit using the preview server (preferred)</summary>

This approach is recommended if you are making heavy changes to a template or are writing a template for a page-type without any published instances. The preview server will load data fresh from the CMS on each page request and processes it through the template at that time, meaning you don't need to wait for a content build to run to see your changes.

1. Run `yarn build:content` and `yarn build:webpack --env.entry=static-pages` to generate the JS/CSS files required by templates. If you make changes to the `static-pages` application code, you will need to run the second command again.
1. Determine the `entityId` of a page that uses the template you are editing.
    - If you are interested in templating against a page already published, you can find its `entityId` by navigating to the page on the website (dev, staging, or prod will all work) and inspecting its DOM. At the top of the DOM should be a comment containing its `entityId`.
    - If you are interested in templating against a page that has not been published, you can look up an `entityId` of that page-type using the [GraphQL Explorer](https://prod.cms.va.gov/graphql/explorer). See the section below for an example.
1. Start the preview server via `yarn preview`. Your SOCKS proxy must be running.
1. Navigated to `http://localhost:3001/preview?nodeId=${YOUR_ENTITY_ID}`
1. After making a change to the template, stop your preview server and start it again. There is no hot reload for the preview server. Fortunately, it is lightweight enough to be quick to stop and start.

If you are getting this error: `Error: HTTP error when fetching manifest: 404 Not Found`, re-run step 1.
### How to look look up an entityId
The following query looks up the `entityId` for one page of the `entityBundle` (page-type) with value `landing_page`. This would be useful if you are interested in making changes to the `landing_page.drupal.liquid` template but are are unsure what pages on the website are instances of that page-type. Run this query using the [GraphQL Explorer](https://prod.cms.va.gov/graphql/explorer).

```graphql
{
  nodeQuery(
    limit: 1,
    filter: {
      conditions: [{field: "type", value: ["landing_page"]}]
    }) {
    entities {
      entityId
    }
  }
}
```

</details>

## Liquid Template Unit Testing Framework

Please see the documentation [here](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/platform/testing/liquid-templates).
