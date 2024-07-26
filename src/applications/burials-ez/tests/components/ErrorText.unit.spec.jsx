import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ErrorText from '../../components/ErrorText';

describe('ErrorText', () => {
  it('should render', () => {
    const { queryByText } = render(<ErrorText />);
    expect(queryByText(/If it still doesn’t work/i)).to.exist;
  });
});
