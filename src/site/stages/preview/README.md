WIP

# Content-Preview Server
This application is used to render content dynamically via a Node server and content API.

## Steps
1. Do a local build so that the Webpack assets are available - `npm run build`
2. Start the preview server - `node script/preview`
3. Navigate to `/preview`, passing a Markdown file's page path as the `contentId` query parameter
    - For example, `http://localhost:3001/preview?contentId=health-care/index.md`.
