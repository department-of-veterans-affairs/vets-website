import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import GetFormHelp from '../../components/GetFormHelp';

describe('GetFormHelp', () => {
  it('should render', () => {
    const { container } = render(<GetFormHelp />);

    expect(container).to.exist;
  });
});
