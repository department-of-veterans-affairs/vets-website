# Vets.gov Breadcrumb Rollout Plan

The Vets.gov breadcrumb enhancement ended up being a fairly large effort. It involved many static pages of content, and a number of React applications. The approach I settled on was two-fold:

1. Add an inline script to all static pages that polls for an appropriate breadcrumb `<nav>` ID, and applies the new logic. This clones the breadcrumb, creates a back by one mobile version, and hides one of the lists based on viewport width. The browser will listen for a `window.resize` event and applies the show/hide logic in a 500ms debounced function. Finally, the script adds an `aria-current="page"` attribute to the last link in the full breadcrumb list. This attribute has CSS to style it differently, and remove pointer events, rendering it non-clickable. This pattern follows the [W3C authoring spec for breadcrumbs](https://www.w3.org/TR/wai-aria-practices-1.1/#breadcrumb).
2. The React apps all use a single `<Breadcrumb />` component now that looks for `children` to wrap in list items. The React version makes use of local state to determine which list to show or hide, and adds the same debounced resize event and `aria` attributes as the static page script. The React version also listens for `componentDidMount` and `componentDidUnmount` lifecycle methods to add and remove the resize event.

## Analytics Findings on Mobile Devices

After digging through the Google Analytics for Vets.gov, I found that Apple devices, specifically the iPhone, were a big portion of our mobile traffic.

1. The single biggest segment by screen resolution was 375x667px.
2. The second biggest segment was Samsung traffic, with resolutions including 360x560, 410x720, and 410x770.
3. These viewport widths should trigger the mobile breadcrumb on first load, and subsequent loads. Testing will be done to ensure high-density displays render the optimal breadcrumb.
4. Viewport breakpoint was consolidated to 481px, same as our SCSS/CSS media query break point. This allowed for using `window.matchMedia` for the conditional width checking.

## Research and Local Testing

1. Research will begin testing this breadcrumb implementation at beginning of PI7
2. I am continuing local browser testing, including:
* Win7 - IE11
* Win7 - Firefox
* Win7 - Chrome
* OSX - Safari
* OSX - Chrome
* OSX - Firefox

## Feature Branch Testing During PR

1. Add unit tests for `<Breadcrumb/>` component
2. Add e2e tests to suite of React apps affirming the `<Breadcrumb/>` component exists, and can be clicked and back-stepped.
3. Investigate testing on Browserstack or SauceLabs account for wider coverage. Possible avenues include:
    * Live testing of `localhost` feature branch with different devices
    * Running our e2e test coverage in different browsers
    * Finalize PR with engineers
4. Promote to `master` branch after daily 2PM EST build, giving a full 24 hour window to test further in staging.

## Device Testing Conducted During PR (Browserstack)

1. Nexus S8 - Chrome
2. Nexus S8 - Firefox
3. Nexus S8 Plus - Chrome
4. Nexus S8 Plus - Firefox
5. iPhone 8 - Chrome
6. iPhone 8 - Safari