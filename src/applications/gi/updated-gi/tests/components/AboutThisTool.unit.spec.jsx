import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { AboutThisTool } from '../../components/AboutThisTool';

describe('About this tool', () => {
  it('Should render two links', () => {
    const { container } = render(<AboutThisTool />);
    expect(container.querySelectorAll('a').length).to.equal(2);
  });
});
