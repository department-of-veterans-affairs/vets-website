import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import DirectDepositViewField from '../../components/DirectDepositViewField';

describe('render direct deposit view component', () => {
  it('should render bank information component wrapper text', () => {
    const defaultProps = {
      errorSchema: {},
      formContext: {
        onError: () => {},
      },
      formData: {
        bankAccount: {
          accountType: 'Savings',
        },
      },
      onChange: () => {},
      onBlur: () => {},
      startEditing: () => {},
      title: '',
    };

    const wrapper = render(<DirectDepositViewField {...defaultProps} />);

    expect(
      wrapper.getByText(
        'Your bank account information is what we currently have on file for you. Please ensure it is correct.',
        { exact: false },
      ),
    ).to.exist;
  });
});
