import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import InfoPair from '../../components/InfoPair';

describe('<InfoPair>', () => {
  it('should render', () => {
    const props = {
      label: 'Item',
      value: 3,
    };
    const { container } = render(<InfoPair {...props} />);
    expect(container.querySelector('*')).to.exist;
  });

  it('should show truthy values', () => {
    const props = {
      label: 'Item',
      value: 3,
    };
    const { container } = render(<InfoPair {...props} />);
    const spanElement = container.querySelector('span');
    expect(spanElement).to.exist;
    expect(spanElement.textContent).to.contain('Item');
  });

  it('should not render if value is not passed in', () => {
    const props = { label: 'Item' };
    const { container } = render(<InfoPair {...props} />);
    expect(container.querySelector('span')).to.be.null;
  });

  it('should not render if value is 0', () => {
    const props = {
      label: 'Item',
      value: 0,
    };
    const { container } = render(<InfoPair {...props} />);
    expect(container.querySelector('span')).to.be.null;
  });

  it('should render if value is 0 when displayIfZero is true', () => {
    const props = {
      label: 'Item',
      value: 0,
      displayIfZero: true,
    };
    const { container } = render(<InfoPair {...props} />);
    expect(container.querySelector('span')).to.not.be.null;
  });
});
