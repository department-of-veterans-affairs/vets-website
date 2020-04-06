# Content-Preview Server

This application is used to render content dynamically via a Node server and content API (Drupal). Its current objective is to render Drupal pages that are not yet published.

## Steps

1. Do a local build so that the Webpack assets are available - `npm run build`
2. Start the preview server - `npm run preview`

Now, by visiting `/preview` and passing a `contentId` query parameter, the Node server will query for that content data followed by rendering that data through the Metalsmith pipeline on the fly. The server will first try to pull the data from the Drupal API, and will otherwise fall back to the `vagov-content` repo of GitHub.

- Example Drupal page: `http://localhost:3001/preview?contentId=/test-page`
- Example GitHub page: `http://localhost:3001/preview?contentId=health-care/index.md`
