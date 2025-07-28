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

describe('CustomPageNavButtons', () => {
  const arrayBuilderProps = {
    arrayPath: 'applicants',
    summaryRoute: '/summaryRoute',
    introRoute: '/introRoute',
    reviewRoute: '/review-and-submit',
    getText: () => {
      'Save and continue';
    },
    required: () => false,
  };

  describe('when in an array builder edit page', () => {
    it('should have va button with submit set to prevent', () => {
      const restoreLocation = stubWindowLocation(
        'http://localhost:3001/form/applicants/0?edit=true',
        '/form/applicants/0?edit=true',
        '?edit=true',
      );
      const props = {
        contentAfterButtons: <></>,
        goBack: () => {},
        onContinue: () => {},
        arrayBuilder: arrayBuilderProps,
      };
      const minimalStore = mockStore({
        form: {
          data: {
            applicants: [{ firstName: 'test first' }],
          },
        },
      });
      const { container } = render(
        <Provider store={minimalStore}>
          <CustomPageNavButtons {...props} />
        </Provider>,
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
      const restoreLocation = stubWindowLocation(
        'http://localhost:3001/form/applicants/0?add=true',
        '/form/applicants/0?add=true',
        '?add=true',
      );
      const props = {
        contentAfterButtons: <></>,
        goBack: () => {},
        onContinue: () => {},
        arrayBuilder: arrayBuilderProps,
        formConfig: { useTopBackLink: true },
      };
      const minimalStore = mockStore({
        form: {
          data: {
            applicants: [{ firstName: 'test first' }],
          },
        },
      });
      const { container } = render(
        <Provider store={minimalStore}>
          <CustomPageNavButtons {...props} />,
        </Provider>,
      );

      // We expect a cancel and continue button to exists
      expect($('va-button', container)['data-action']).to.eq('cancel');
      expect($('button.usa-button-primary', container)).to.have.text(
        'Continue',
      );
      restoreLocation();
    });
  });

  describe('when in a non-array custom page', () => {
    it('should have back/continue buttons', () => {
      const restoreLocation = stubWindowLocation(
        'http://localhost:3001/form/somepath',
        '/form/somepath',
      );
      const props = {
        contentAfterButtons: <></>,
        goBack: () => {},
        onContinue: () => {},
      };
      const minimalStore = mockStore({
        form: {
          data: {},
        },
      });
      const { container } = render(
        <Provider store={minimalStore}>
          <CustomPageNavButtons {...props} />,
        </Provider>,
      );

      expect($('button.usa-button-secondary', container)).to.have.text('Back');
      expect($('button.usa-button-primary', container)).to.have.text(
        'Continue',
      );
      restoreLocation();
    });
  });
});
