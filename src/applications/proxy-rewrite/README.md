# Proxy Rewrite
This `proxy-rewrite` application is used to inject site-wide VA.gov components into webpages and domains outside of those in our domain or in our source code. The affected sites are generally referred to as "TeamSite", because TeamSite is the name of the CMS in use on those pages.

This works by -

1. A request is sent to a VA.gov website
2. The request passes through the www.va.gov servers, where a code snippet is added into the page
3. This code snippet is ultimately a link to the production `proxy-rewrite` bundle, where the `proxy-rewrite-entry` begins processing the page.
4. If the webpage is listed in the `proxy-rewrite-whitelist.json`, the site-wide components are rendered onto the page.

## Local Dev
Because we're dependent on the DOM of webpages outside of our source code, local development is somewhat tricky. However, to make this easier, you can run the watch task with a flag indicating that `proxy-rewrite` development, which will ultimately serve as a local proxy. The reason this behavior is not enabled by default is that we don't want to hit the production servers unless we have to, which is the case for TeamSite development.

```
npm run watch -- --local-proxy-rewrite
```

Next, navigate to localhost, but passing a VA.gov domain via a `target` query parameter -

```
http://localhost:3001/?target=https://www.va.gov/health/
```

`https://www.va.gov/health/` should load, but with your local `proxy-rewrite` bundle injected into the page. You can confirm this by checking you network requests or by adding an `alert` into your bundle entry.

## Charles Proxy
You can also use an application called Charles Proxy to map the `proxy-rewrite` bundles of TeamSite pages to your local machine. This way you can navigate directly to `https://www.va.gov/health/` and when the request for the production bundle of `proxy-rewrite` is sent, Charles will have overridden that file to instead be served locally. Instructions to set this up are located here, https://github.com/department-of-veterans-affairs/vets.gov-team/blob/master/Work%20Practices/Engineering/Teamsite.md.
