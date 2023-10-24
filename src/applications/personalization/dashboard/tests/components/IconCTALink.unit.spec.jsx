import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import IconCTALink from '../../components/IconCTALink';

describe('<IconCTALink />', () => {
  it('should render', () => {
    const linkText = 'Testing link';
    const tree = render(
      <IconCTALink testId="12345" href="https://example.com" text={linkText} />,
    );
    expect(tree.getByTestId('12345')).to.exist;
    expect(tree.getByText(linkText)).to.exist;
  });
});
