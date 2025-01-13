import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import SchoolsAndEmployers from '../../containers/SchoolsAndEmployers';

describe('Schools and employers', () => {
  it('Renders without crashing', () => {
    const { container } = render(<SchoolsAndEmployers />);
    expect(container).to.exist;
  });
});
