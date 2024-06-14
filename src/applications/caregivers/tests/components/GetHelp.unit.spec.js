import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import GetHelp from '../../components/GetHelp';

describe('CG <GetHelp>', () => {
  it('should render', () => {
    const view = render(<GetHelp />);
    const selector = view.container.querySelectorAll('.help-talk');
    expect(selector).to.have.lengthOf(4);
  });
});
