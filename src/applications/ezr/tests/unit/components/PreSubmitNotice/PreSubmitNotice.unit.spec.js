import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import PreSubmitNotice from '../../../../components/PreSubmitNotice';
import content from '../../../../locales/en/content.json';

describe('ezr <PreSubmitNotice>', () => {
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
      error: content['presubmit-error-message'],
      label: content['presubmit-checkbox-label'],
    },
    showError: false,
    onSectionComplete: sinon.spy(),
  };

  describe('when the component renders', () => {
    it('should render the agreement checkbox', () => {
      const { container } = render(
        <Provider store={defaultStore}>
          <PreSubmitNotice {...defaultProps} />
        </Provider>,
      );
      const {
        preSubmitInfo: { label, required, field },
      } = defaultProps;
      const selector = container.querySelector(`[name="${field}"]`);
      expect(selector).to.exist;
      expect(selector).to.have.attr('label', label);
      expect(selector).to.have.attr('required', `${required}`);
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
