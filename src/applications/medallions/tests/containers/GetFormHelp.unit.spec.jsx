import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import GetFormHelp from '../../containers/GetFormHelp';

describe('GetFormHelp', () => {
  it('renders without crashing', () => {
    const { container } = render(<GetFormHelp />);
    expect(container).to.exist;
  });
});
