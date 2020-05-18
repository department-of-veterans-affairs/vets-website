# Mega menu configuration
This document describes how the MegaMenu is configured in vets-website. There are a lot of moving pieces in how the MegaMenu is setup on vets-website. It is not initially apparent how everything works by just looking at the code. This document will walk you through how the MegaMenu is configured.

## MegaMenu react component
You can find documentation on the MegaMenu component at [MegaMenu](https://department-of-veterans-affairs.github.io/veteran-facing-services-tools/visual-design/components/megamenu/). This should give you a basic overview of how the MegaMenu needs to be setup.

## Entry point
The way React components work in vets-website is that they are injected into web pages in vets-website. The HTML element that the MegaMenu is attaching to can be found at */src/site/includes/top-nav.html*. The entry point where the MegaMenu is injected into the site is at */src/platform/site-wide/index.js*. Here you will see.

```
startMegaMenuWidget(window.VetsGov.headerFooter.megaMenuData, commonStore);
```

As you can see we pass in a data argument located at `window.VetsGov.headerFooter.megaMenuData`. This data is derived from a YAML file located in the ***vagov-content*** repo at ***vagov-content/fragments/megamenu/index.yaml***. There is a MetalSmith plugin that we created to add this to the global window. This is done in the build process. You can find the plugin code at */src/site/stages/build/plugins/create-header-footer.js*

## Redux
The MegaMenu uses Redux to store it's state. You can find the container component at */src/platform/site-wide/mega-menu/containers/Main.jsx. This is where all logic for the component lives. You will also find all of the common Redux files (actions, reducers) in the *mega-menu* folder.
