import {
  FOCUSABLE_ELEMENTS,
  SCROLL_ELEMENT_SUFFIX,
} from '../../../../../utilities/constants';

import {
  focusOnChange,
  focusElement,
  getFocusableElements,
  fixSelector,
  scrollToElement,
} from '.';

import {
  focusableWebComponentList,
  webComponentsWithHeaders,
} from '../../web-component-fields/webComponentList';

export const focusReview = (name, editing, reviewEditFocusOnHeaders) => {
  setTimeout(() => {
    const scrollName = `${name}${SCROLL_ELEMENT_SUFFIX}`;
    const scrollElement = document.querySelector(`[name="${scrollName}"]`);

    if (scrollElement && scrollElement?.nextElementSibling) {
      scrollToElement(scrollName);
      const pageWrap = scrollElement.nextElementSibling;

      const focusOnFirstFocusableElement = () => {
        const [target] = getFocusableElements(pageWrap, {
          returnWebComponent: true,
          focusableWebComponents: focusableWebComponentList,
        });

        if (target) {
          let selector = target.tagName;
          // File upload pages may only show a delete va-button (form 10182)
          const shadowSelector = selector.startsWith('VA-')
            ? [...FOCUSABLE_ELEMENTS, ...focusableWebComponentList].join(',')
            : null;

          // Sets focus on the first focusable error or element
          if (target.id) {
            // id may include a colon, e.g. #root_view:foo
            selector = `#${target.id}`;
          } else if (target.className) {
            selector = `${target.tagName}.${target.className
              .split(' ')
              .join('.')}`;
          }
          focusOnChange(name, fixSelector(selector), shadowSelector);
        }
      };

      if (editing && reviewEditFocusOnHeaders) {
        // Headers inside accordion; should be an h4, but the page h3 may not
        // be properly updated to an h4 on the review & submit page
        const headers = 'h3,h4,h5,h6';
        const [target] = getFocusableElements(pageWrap, {
          returnWebComponent: true,
          // look for headers _above_ web components first
          focusableElements: headers.split(','),
          focusableWebComponents: webComponentsWithHeaders,
        });

        let root = pageWrap;
        const tag = target?.tagName || '';
        if (tag.startsWith('H')) {
          focusElement(target);
        } else if (tag.startsWith('VA-')) {
          const wcName = target?.getAttribute('name');
          // Target WC using name attribute and as a selector; it works
          // better within the focusElement WC checks to be a string
          root = `${tag}${wcName ? `[name="${wcName}"]` : ''}`;
          focusElement(headers, {}, root);
        }
        // check if nothing is focused, i.e. root doesn't contain any headers
        setTimeout(() => {
          if (document.activeElement.tagName === 'BODY') {
            focusOnFirstFocusableElement();
          }
        }, 250);
      } else {
        focusOnFirstFocusableElement();
      }
    }
  }, 100);
};
