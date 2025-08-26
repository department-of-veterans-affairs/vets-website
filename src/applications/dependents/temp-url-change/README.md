Setting up these folders to get content build to build the apps at the new URL, see [PR merge order](https://depo-platform-documentation.scrollhelp.site/developer-docs/creating-a-new-application#Creatinganewapplication-PRmergeorder), because `content-build` needs the CSS files from `vets-website`.

The new URL is used here first, then once we switch the URL, we can then update the original `manifest.json` files for each app to point to the new URL, and delete this entire `temp-url-change` folder
