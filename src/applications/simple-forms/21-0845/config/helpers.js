import {
  getScrollOptions,
  waitForRenderThenFocus,
} from 'platform/utilities/ui';
import scrollTo from 'platform/utilities/ui/scrollTo';

export const pageFocusScroll = () => {
  return () => {
    const { pathname } = document.location;
    let focusSelector = '';

    if (pathname.includes('authorizer-type')) {
      // focus on custom-h3 for authorizer-type page
      focusSelector = '#root_authorizerType-label';
    } else {
      // since useCustomScrollAndFocus is enabled at form-level,
      // this fn fires on every chapter change, so we need to
      // provide default focusSelector for all other pages.
      focusSelector = '#nav-form-header';
    }

    waitForRenderThenFocus(focusSelector);
    setTimeout(() => {
      scrollTo(
        focusSelector.replace(/#/gi, ''),
        getScrollOptions({ offset: 0 }),
      );
    }, 100);
  };
};
