import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import PreSubmitNotice from '../../../components/PreSubmitNotice';

describe('hca <PreSubmitNotice>', () => {
  const defaultProps = {
    formData: {},
    preSubmitInfo: {
      required: true,
      field: 'privacyAgreementAccepted',
      error: 'You must accept the agreement before continuing.',
      label:
        'I certify the information above is correct and true to the best of my knowledge and belief.',
    },
    showError: false,
    onSectionComplete: sinon.spy(),
  };

  it('should render', () => {
    const { container } = render(<PreSubmitNotice {...defaultProps} />);
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
    expect(checkbox).to.have.attribute('checked', 'false');
  });

  it('should render error message if data is false and `showError` is set to true', () => {
    const props = { ...defaultProps, showError: true };
    const { container } = render(<PreSubmitNotice {...props} />);
    const checkbox = container.querySelector(
      `[name="${defaultProps.preSubmitInfo.field}"]`,
    );

    expect(checkbox).to.have.attribute(
      'error',
      defaultProps.preSubmitInfo.error,
    );
  });

  it('should not render error message if data is true', () => {
    const props = {
      ...defaultProps,
      formData: { privacyAgreementAccepted: true },
    };
    const { container } = render(<PreSubmitNotice {...props} />);
    const checkbox = container.querySelector(
      `[name="${defaultProps.preSubmitInfo.field}"]`,
    );

    expect(checkbox).to.not.have.attribute(
      'error',
      defaultProps.preSubmitInfo.error,
    );
  });

  it('should fire `onSectionComplete` when the onChange event is triggered from the checkbox', () => {
    const { container } = render(<PreSubmitNotice {...defaultProps} />);
    const checkbox = container.querySelector(
      `[name="${defaultProps.preSubmitInfo.field}"]`,
    );
    checkbox.__events.vaChange();
    expect(defaultProps.onSectionComplete.called).to.be.true;
  });
});
