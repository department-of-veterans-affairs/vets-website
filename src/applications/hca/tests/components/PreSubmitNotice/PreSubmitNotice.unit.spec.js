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

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <PreSubmitNotice {...defaultProps} />
      </Provider>,
    );
    const checkbox = container.querySelector(
      `[name="${defaultProps.preSubmitInfo.field}"]`,
    );

    expect(
      container.querySelectorAll(
        'li',
        '[data-testid="hca-agreement-statements"]',
      ),
    ).to.have.lengthOf(4);
    expect(container.querySelector('va-additional-info')).to.exist;
    expect(checkbox).to.exist;
    expect(checkbox).to.have.attribute(
      'label',
      defaultProps.preSubmitInfo.label,
    );
    expect(checkbox).to.have.attribute(
      'required',
      `${defaultProps.preSubmitInfo.required}`,
    );
  });

  it('should render error message if form data value is false and `showError` is set to true', () => {
    const props = { ...defaultProps, showError: true };
    const { container } = render(
      <Provider store={defaultStore}>
        <PreSubmitNotice {...props} />
      </Provider>,
    );
    const checkbox = container.querySelector(
      `[name="${defaultProps.preSubmitInfo.field}"]`,
    );

    expect(checkbox).to.have.attribute(
      'error',
      defaultProps.preSubmitInfo.error,
    );
  });

  it('should not render error message if form data value is true', () => {
    const props = {
      ...defaultProps,
      formData: { privacyAgreementAccepted: true },
    };
    const { container } = render(
      <Provider store={defaultStore}>
        <PreSubmitNotice {...props} />
      </Provider>,
    );
    const checkbox = container.querySelector(
      `[name="${defaultProps.preSubmitInfo.field}"]`,
    );

    expect(checkbox).to.not.have.attribute(
      'error',
      defaultProps.preSubmitInfo.error,
    );
  });

  it('should not render error message if form has been submitted', () => {
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
    const checkbox = container.querySelector(
      `[name="${defaultProps.preSubmitInfo.field}"]`,
    );

    expect(checkbox).to.not.have.attribute(
      'error',
      defaultProps.preSubmitInfo.error,
    );
  });

  it('should fire `onSectionComplete` when the checkbox is clicked', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <PreSubmitNotice {...defaultProps} />
      </Provider>,
    );
    const checkbox = container.querySelector(
      `[name="${defaultProps.preSubmitInfo.field}"]`,
    );
    fireEvent.click(checkbox);
    expect(defaultProps.onSectionComplete.called).to.be.true;
  });
});
