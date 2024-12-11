import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import GetFormHelp from '../../../components/GetFormHelp';

describe('<GetFormHelp>', () => {
  it('renders', () => {
    const { container } = render(<GetFormHelp />);

    expect(container.querySelectorAll('va-telephone')).to.have.lengthOf(2);
  });
});
