/**
 * Tests for shared CustomPageNavButtons component
 */
import { expect } from 'chai';
import React from 'react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { CustomPageNavButtons } from '../../../../shared/components/CustomPageNavButtons';

const mockStore = state => createStore(() => state);

function stubWindowLocation(url, pathname, search) {
  const originalLocation = window.location;

  Object.defineProperty(window, 'location', {
    writable: true,
    value: { href: url, pathname, search },
  });

  return () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  };
}

/**
 * Renders CustomPageNavButtons with the provided setup config.
 * @param {Object} props Props to pass to CustomPageNavButtons
 * @param {Object} storeData Data to include in the mockStore
 * @param {String} url URL of page where component would be rendered, including any search params
 * @returns Object containing the rendered component (in `container`), and a restoreLocation func to reset current window location
 */
function setupComponent(
  props,
  storeData,
  url = 'http://localhost:3001/form/somepath',
) {
  const { pathname } = new URL(url);
  const { search } = new URL(url);
  const restoreLocation = stubWindowLocation(url, pathname, search);

  const store = mockStore({
    form: {
      data: storeData || {},
    },
  });

  const result = render(
    <Provider store={store}>
      <CustomPageNavButtons {...props} />
    </Provider>,
  );

  return { ...result, restoreLocation };
}

describe('CustomPageNavButtons', () => {
  const arrayBuilderProps = {
    arrayPath: 'applicants',
    getSummaryPath: () => '/summaryRoute',
    getIntroPath: () => '/introRoute',
    reviewRoute: '/review-and-submit',
    getText: () => {},
    required: () => false,
  };

  describe('when in an array builder edit page', () => {
    it('should have va button with submit set to prevent', () => {
      const props = {
        contentAfterButtons: <></>,
        goBack: () => {},
        onContinue: () => {},
        arrayBuilder: arrayBuilderProps,
      };
      const { container, restoreLocation } = setupComponent(
        props,
        { applicants: [{ firstName: 'test first' }] },
        'http://localhost:3001/form/applicants/0?edit=true',
      );
      // We expect a cancel and continue button to exists
      expect($('va-button[data-action="cancel"]', container)).to.exist;
      // continue button has a submit="prevent" property in this configuration
      expect($('va-button[continue="true"]', container)).to.exist;
      restoreLocation();
    });
  });

  describe('when in an array builder add page', () => {
    it('should have va button to cancel', () => {
      const props = {
        contentAfterButtons: <></>,
        goBack: () => {},
        onContinue: () => {},
        arrayBuilder: arrayBuilderProps,
        formConfig: { useTopBackLink: true },
      };
      const { container, restoreLocation } = setupComponent(
        props,
        { applicants: [{ firstName: 'test first' }] },
        'http://localhost:3001/form/applicants/0?add=true',
      );
      // We expect a cancel and continue button to exists
      expect($('va-button[data-action="cancel"]', container)).to.exist;
      expect($('button.usa-button-primary', container)).to.have.text(
        'Continue',
      );
      restoreLocation();
    });
  });

  describe('when in a non-array custom page', () => {
    it('should have back/continue buttons', () => {
      const props = {
        contentAfterButtons: <></>,
        goBack: () => {},
        onContinue: () => {},
      };
      const { container, restoreLocation } = setupComponent(props, {});
      expect($('button.usa-button-secondary', container)).to.have.text('Back');
      expect($('button.usa-button-primary', container)).to.have.text(
        'Continue',
      );
      restoreLocation();
    });
  });
});
