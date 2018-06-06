## Using React on static content pages

The way vets-website is built means that we have two types of content to users: static pages and React apps. Our static pages are rendered ahead of time, while React apps are rendered client-side. However, the static pages do have some content rendered client-side, namely the sign in widget. This means we're including React on all static pages, so it is possible to use it if you need it.

All the static pages use the static-pages entry bundle, so any JS code included from that file will be on all static pages. You can easily create a div with a particular id in a static content page, then include JS that renders a React component into that div, the same way any of our React apps do.

### Guidelines for using React on a static page

All that said, we should be careful to not create a bad user experience when using React on static pages. Here are some guidelines you should follow:

1. JS and React take time to download, parse, and render. Make sure you are providing the appropriate feedback to users while that is happening, with a spinner or another method from the UX team.
2. Make sure the page is still usable if your React code fails to work. This can mean it fails to download, an error occurs, or just handling the different login states a user can be in.
3. Be aware of how much weight you're adding to the static-pages bundle and code-split/lazy load when it makes sense.

### Common widget code

There's a simple static page widget feature that you can use to help with the first two points above. The code is in `src/applications/static-pages/static-page-widgets.js`. Using this will inline some JS that can handle displaying a loading spinner and showing an error message if something goes wrong before the React code can take over rendering. Several pension pages use this functionality (`content/pages/pension/index.md`, `content/pages/pension/apply.md`). It's controlled by defining a widgets list in the front matter for the static content page you're on. The options are:

```
- widgets
  - root: react-applicationStatus
    timeout: 20
    showSpinnerUnauthed: false
    slowLoadingThreshold: 6
    loadingMessage: Loading
    slowMessage: Sorry, this is taking longer than expected.
    errorMessage: Sorry, something went wrong.
```

- root: The id of the div where the React component will mount.
- timeout: The amount of time in seconds before the error message is shown.
- showSpinnerUnauthed: By default, a spinner is shown only if a user has a session token. This will override that and show it always.
- slowLoadingThreshold: The amount of time in seconds before the slow loading message is shown. This is skipped if the threshold is greater than the overall timeout. Defaulted to 6 seconds.
- slowMessage: Message shown when the slowThreshold is passed. Defaulted to message above.
- loadingMessage: Message shown while the JS code is loading. This should probably match any loading message in your React code.
- errorMessage: Message shown when the JS code fails or times out.
