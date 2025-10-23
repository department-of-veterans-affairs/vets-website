# What are the "injected" header/footer and TeamSites?
The VA.gov modernization project will take years to bring all VA content from various administrations into the modernized VA.gov experience. "TeamSites" refers to a legacy CMS that VA subdomains (e.g. https://benefits.va.gov) use. Those subdomains are part of the VA ecosystem but have not yet migrated their content to the modernized site (https://www.va.gov). **VFS teams do not manage or have access to TeamSites code or content**. Using the "injected" header/footer is an opt-in process. In those cases, we provide the "injected" (modernized) header/footer using the `proxy-rewrite` application and a cookie. Injecting the header/footer enables users of TeamSites to easily access benefits information on the modernized site.

[This runbook](https://github.com/department-of-veterans-affairs/va.gov-team/tree/master/products/header-footer/injected-header) describes how TeamSites owners can request header/footer injection.

This is the full list of TeamSites that currently use the injected header/footer: https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/proxy-rewrite/proxy-rewrite-whitelist.json#L33-L177 (look for `"cookieOnly": false` for more straightforward testing).

## Web components and TeamSites
Previously, the VA.gov header/footer and the TeamSites header/footer shared quite a bit of code. This helped to reduce tech debt, code duplication and defects.

However, an effort is underway to convert the VA.gov header/footer to web components in the Design System library. Because the code between the VA.gov header/footer and TeamSites header/footer is shared **and** TeamSites do not support web components, we needed to separate the code for Teamsites as much as possible.

As a result, all of the TeamSites header/footer code is now contained in `src/applications/proxy-rewrite` and is 100% duplicative of the VA.gov header/footer. There is a single style file in `proxy-rewrite/sass`, and all of the injection code is still present within this folder. The application has very little dependency on other code within the vets-website repo (with the exception of Platform utilities).

### The downsides of an encapsulated injected header/footer app
Aside from tech debt and code duplication:

1. Any visual or structural changes made to the VA.gov (modernized) header/footer should also be applied and tested in the injected header/footer to keep the experience consistent
2. The injected header/footer uses some Platform utility functions. If there are changes to these utilities, you must remember to test those changes against the injected header/footer

## Do I need content-build running locally to test TeamSites?
**No, but:** `content-build` generates a static JSON file with all of the Drupal data for the header/footer that TeamSites uses. It is called `headerFooter.json` and lives in `vets-website/build/localhost/generated/`. In order to ensure you have the most up-to-date Drupal data, you will need to have built `content-build` very recently. But the `content-build` repository does not need to be running in order to load TeamSites locally as you will be hitting port 3001 (which does not work with `content-build`).

This file is created by running `yarn build` from `content-build`. Without optimization, this build step can take upwards of 8 hours. [Refer to this guide](https://github.com/department-of-veterans-affairs/content-build?tab=readme-ov-file#optimizing-build-time) to optimize your `content-build` and more quickly get up and running. **You will only need to do this once**, or whenever Drupal data for the header/footer is updated and affects your testing. Otherwise, as long as the `headerFooter.json` file exists, you can test the injected header/footer locally.

Note: [next-build](https://github.com/department-of-veterans-affairs/next-build) which will eventually replace `content-build` in its entirety but will pull Drupal data the same way.

## Where does the header/footer data come from?
[This README](https://github.com/department-of-veterans-affairs/va.gov-team/edit/master/products/header-footer/engineering/README.md) has a detailed explanation of the how the data is retrieved from Drupal and combined with hard-coded markup to create the header/footer.

## Header/footer injection "Gotchas"
1. **Whitelisting must consider root vs. path,** if a path within a domain is receiving injection, e.g. https://github.com/department-of-veterans-affairs/vets-website/commit/74e156a10b2d58c040981c99f454d2ccb5cdcb1d, the path needs to be separated from the domain.

2. **Footer injection requires specific markup in the TeamSite.** Injection was configured with the expectation that we are injecting into the standard TeamSite template. In TeamSites, the footer is preceded by 2 `div`s with the classes `sub-footer` and `small-print` respectively. If those `div`s are not present in the template, footer will not inject.

3. **Header may affect font size for the page** to 12px. Specifying font size via scaling may result in too large text loading, then abruptly adjusting to the correct size after the header completes injection.  Other teams have fixed this by resetting the default font size inside the first element which would appear under the header after injection via inline css. This seems to keep the app fonts consistent without the awkward large to small size change on page load.

4. **Injection will only work for standard TeamSites.** The header/footer cannot be injected into other VA sites/CMSs.

## How does the injected header/footer get injected?
The code responsible for doing the injection is found in `proxy-rewrite-entry.jsx`. When that code is run in the browser, it effectively looks for an existing header/footer and then replaces those with the VA.gov header/footer.

[DEPO teamsite overview](https://depo-platform-documentation.scrollhelp.site/developer-docs/teamsite-overview) - contains more context and explains the cookie mechanisms, and notes on testing. 

`proxy-rewrite-entry.jsx` makes its way to the browser because there's a script tag in the `<head>` of the HTML document:

```
<script type="text/javascript" src="https://prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com/generated/proxy-rewrite.entry.js"></script>
```

(note: `proxy-rewrite-entry.jsx` is packaged up and compiled down to `proxy-rewrite.entry.js`).

That script tag is [part of the HTML generated by the TeamSite page](https://depo-platform-documentation.scrollhelp.site/developer-docs/teamsite-overview#TeamSiteoverview-ScriptsandTeamSiteAdministration).

From there a cookie is enabled as `true` that allows for testing pre-production. When a TeamSite has verified presentation and the injected header is ready to be presented in production, that cookie is updated in the white list file, set to `false`.

## What's the "proxy" piece mean?
The "proxy" is used to enable local development. Because we're dependent on the DOM of webpages outside of our source code, we cannot render the TeamSites locally and we need a workaround. This "proxy" piece provides that workaround by creating a mechanism that enables rendering the VA.gov header/footer on the production TeamSite pages locally.

## How do I run the injected header/footer locally?

### Run `yarn watch local-proxy-rewrite` in your vets-website terminal

Running the `watch` command with a `local-proxy-rewrite` flag enables the local Webpack dev server to act kind of like a proxy. When the server is enabled with this flag, and when it subsequently receives a request for a URL that includes a `target` query parameter (e.g. http://localhost:3001/?target=https://www.va.gov/health), it fetches the HTML of the page indicated in that query parameter and *rewrites* the URLs for certain production resources so that they are instead served locally.

Example:

```
<script type="text/javascript" src="https://prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com/generated/proxy-rewrite.entry.js"></script>
```

Becomes:

```
<script type="text/javascript" src="generated/proxy-rewrite.entry.js"></script>
```

Then, the Webpack dev server returns the adjusted HTML as the response to the original request, which has the effect of serving the `target` page with the local JS that will ultimately render the VA.gov header/footer.

#### Once you have the `yarn watch local-proxy-rewrite` build running, navigate to a supported TeamSite:

```
http://localhost:3001/?target=https://www.va.gov/health/
```

You can replace `https://www.va.gov/health` in this example with any of the URLs in [the whitelist](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/proxy-rewrite/proxy-rewrite-whitelist.json#L33-L177).


### An alternative way to run the injected header/footer locally: Charles Proxy
You can also use an application called Charles Proxy to map the `proxy-rewrite` bundles of TeamSite pages to your local machine. This way you can navigate directly to `https://www.va.gov/health/` and when the request for the production bundle of `proxy-rewrite` is sent, Charles will have overridden that file to instead be served locally. Instructions to set this up are located here, https://depo-platform-documentation.scrollhelp.site/developer-docs/charles-proxy-setup-for-teamsite.

## How do I test across environments?
As of September 2024, TeamSites do not have sandbox or staging environments that are accessible by VFS teams, if at all. You can run the `proxy-rewrite` locally to validate the TeamSites injected header/footer, but after merging to `main`, **the next environment you will see your code is in production**.

## Ownership
The injected header/footer design and code are owned by the Design System Team. DSVA Slack channel: #platform-design-system

The process of injecting the header/footer into TeamSites is owned by the VFS Sitewide team (VA Product Owner = Michelle Middaugh). DSVA Slack channel: #sitewide-public-websites.

If a new site requires the injected header, check [Injected Header product Runbook documentation](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/header-footer/injected-header/README.md#runbook-adding-injected-header-to-new-teamsite) for more information on how to request.