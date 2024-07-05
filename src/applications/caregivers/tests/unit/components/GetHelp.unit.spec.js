import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import GetHelp from '../../../components/GetHelp';

describe('CG <GetHelp>', () => {
  it('should render', () => {
    const { container } = render(<GetHelp />);
    const selector = container.querySelectorAll('.help-talk');
    expect(selector).to.have.length;
  });
});
