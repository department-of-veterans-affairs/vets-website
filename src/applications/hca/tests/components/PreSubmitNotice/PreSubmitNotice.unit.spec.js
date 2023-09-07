import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import PreSubmitNotice from '../../../components/PreSubmitNotice';

describe('hca <PreSubmitNotice>', () => {
  const defaultStore = {
    getState: () => ({
      form: {
        submission: {},
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };
  const defaultProps = {
    formData: {},
    preSubmitInfo: {
      required: true,
      field: 'privacyAgreementAccepted',
      error: 'You must accept the agreement before continuing.',
      label: `I confirm that I agree to the statements listed here.
          The information is true and correct to the best of my knowledge and belief.
          I\u2019ve read and accept the privacy policy.`,
    },
    showError: false,
    onSectionComplete: sinon.spy(),
  };

  describe('when the component renders', () => {
    it('should render with default attributes', () => {
      const { container } = render(
        <Provider store={defaultStore}>
          <PreSubmitNotice {...defaultProps} />
        </Provider>,
      );
      const {
        preSubmitInfo: { label, required, field },
      } = defaultProps;
      const selectors = {
        checkbox: container.querySelector(`[name="${field}"]`),
        benefits: container.querySelector('va-additional-info'),
        statements: container.querySelectorAll(
          'li',
          '[data-testid="hca-agreement-statements"]',
        ),
      };
      expect(selectors.statements).to.have.lengthOf(4);
      expect(selectors.benefits).to.exist;
      expect(selectors.checkbox).to.exist;
      expect(selectors.checkbox).to.have.attr('label', label);
      expect(selectors.checkbox).to.have.attr('required', `${required}`);
    });
  });

  describe('when the form is submitted', () => {
    it('should not render error message if data value is `true`', () => {
      const props = {
        ...defaultProps,
        formData: { privacyAgreementAccepted: true },
      };
      const { container } = render(
        <Provider store={defaultStore}>
          <PreSubmitNotice {...props} />
        </Provider>,
      );
      const {
        preSubmitInfo: { field, error },
      } = defaultProps;
      const selector = container.querySelector(`[name="${field}"]`);
      expect(selector).to.not.have.attribute('error', error);
    });

    it('should not render error message if submission status is pending', () => {
      const store = {
        getState: () => ({
          form: {
            submission: {
              status: 'submitPending',
            },
          },
        }),
        subscribe: () => {},
        dispatch: () => {},
      };
      const props = {
        ...defaultProps,
        formData: { privacyAgreementAccepted: true },
      };
      const { container } = render(
        <Provider store={store}>
          <PreSubmitNotice {...props} />
        </Provider>,
      );
      const {
        preSubmitInfo: { field, error },
      } = defaultProps;
      const selector = container.querySelector(`[name="${field}"]`);
      expect(selector).to.not.have.attribute('error', error);
    });
  });

  describe('when an error occurs', () => {
    it('should render error message if data value is `false` and `showError` is `true`', () => {
      const props = { ...defaultProps, showError: true };
      const { container } = render(
        <Provider store={defaultStore}>
          <PreSubmitNotice {...props} />
        </Provider>,
      );
      const {
        preSubmitInfo: { field, error },
      } = defaultProps;
      const selector = container.querySelector(`[name="${field}"]`);
      expect(selector).to.have.attribute('error', error);
    });
  });

  describe('when the checkbox is clicked', () => {
    it('should fire `onSectionComplete` function', () => {
      const { container } = render(
        <Provider store={defaultStore}>
          <PreSubmitNotice {...defaultProps} />
        </Provider>,
      );
      const {
        onSectionComplete,
        preSubmitInfo: { field },
      } = defaultProps;
      const selector = container.querySelector(`[name="${field}"]`);
      fireEvent.click(selector);
      expect(onSectionComplete.called).to.be.true;
    });
  });
});
