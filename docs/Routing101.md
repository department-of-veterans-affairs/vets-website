## Routing for React apps

### Production
The production deployment of the vet-website front end consists of static HTML, CSS, and JS assets deployed to an Amazon S3 bucket. We have an nginx server that serves those static assets and does some extra route handling for our single page React apps.

React applications have a single entry page in the `content/pages` folder and a special nginx [config entry](https://github.com/department-of-veterans-affairs/devops/blob/master/ansible/deployment/config/revproxy-vetsgov/vars/react_routes.yml). Each of the React applications listed in that config are standalone single page apps, and for each of the urls listed in that section of the config, the nginx server routes anything that starts with that url to the static page at that url, instead of trying to find a content page at that spot in the `content/pages` folder structure. See the example below for a step by step view of that process.

When that page is loaded and the JS bundle is downloaded and parsed, React Router sees the original route, removes the base url specified in the entry page from it, and routes to the page configured in the routes for the React app.

In summary, nginx routes a variety of different urls to the same static entry page, and React Router renders the correct component based on the route configuration client side.

#### Example

Here's an example using the claim status application:

1. User opens `vets.gov/track-claims/your-claims/2344/detail`
2. Nginx serves `vets.gov/track-claims/index.html`, because `/track-claims` is configured as a React application
3. In the browser, the JS bundle loads and React Router sees a url of `/track-claims/your-claims/2344/detail`
4. Since React Router has a base url of `/track-claims`, it runs its routing logic on `/your-claims/2344/detail`, and renders the appropriate component for that url.

One other thing to note is that links that use the `Link` component or the `router` object in the React app use the history api to change the url without reloading the page. React Router listens for these url changes and renders the right component for you. This is why you have to use `Link` and not a regular `a` element, which results in a page refresh for the url you're trying to link to.

### Development

Locally, we've configured the webpack dev server to do the same redirects as nginx, however they are duplicated in a couple places:

- [script/build.js](https://github.com/department-of-veterans-affairs/vets-website/blob/master/script/build.js)
- [src/platform/testing/e2e/test-server.js](https://github.com/department-of-veterans-affairs/vets-website/blob/master/src/platform/testing/e2e/test-server.js) (for e2e tests)

You will need to update these locations as well as the nginx config when creating a new React application.
