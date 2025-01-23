import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import SchoolsAndEmployers from '../../containers/SchoolsAndEmployers';

describe('Schools and employers', () => {
  it('Renders without crashing', () => {
    const { getByText } = render(<SchoolsAndEmployers />);
    expect(getByText('Schools and employers')).to.exist;
  });

  it('Renders with Search by name as default tab', () => {
    const { getByRole } = render(<SchoolsAndEmployers />);
    const nameTab = getByRole('tab', { name: 'Search by name' });
    expect(nameTab.getAttribute('aria-selected')).to.equal('true');
  });
});
