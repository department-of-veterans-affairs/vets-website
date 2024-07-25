import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import SignatureCheckbox from '../../../../components/PreSubmitInfo/SignatureCheckbox';

const getData = ({ isRepresentative = false, label } = {}) => ({
  mockProps: {
    children: undefined,
    fullName: {
      first: 'John',
      middle: '',
      last: 'Smith',
    },
    label,
    setSignatures: () => {},
    showError: false,
    submission: {},
    isRequired: false,
    isRepresentative,
  },
});

describe('CG <SignatureCheckbox>', () => {
  it('should render message-aria-describedby attribute when "isRepresentative" is true', () => {
    const label = 'test-label';
    const { mockProps } = getData({
      isRepresentative: true,
      label,
    });
    const view = render(<SignatureCheckbox {...mockProps} />);
    const inputComponent = view.container.querySelector('.signature-input');

    expect(inputComponent).to.have.attribute(
      'message-aria-describedby',
      'on behalf of John Smith',
    );
  });

  it('should not render message-aria-describedby attribute when "isRepresentative" is false', () => {
    const label = 'test-label';
    const { mockProps } = getData({
      isRepresentative: false,
      label,
    });
    const view = render(<SignatureCheckbox {...mockProps} />);
    const inputComponent = view.container.querySelector('.signature-input');

    expect(inputComponent).to.not.have.attribute('message-aria-describedby');
  });
});
