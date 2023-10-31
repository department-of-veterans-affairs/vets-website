import React from 'react';
import { render } from '@testing-library/react';
import ErrorText from '../../components/ErrorText';

describe('ErrorText', () => {
  it('should render error text', () => {
    const tree = render(<ErrorText />);

    tree.getByText('If it still doesn’t work, please');
  });
});
