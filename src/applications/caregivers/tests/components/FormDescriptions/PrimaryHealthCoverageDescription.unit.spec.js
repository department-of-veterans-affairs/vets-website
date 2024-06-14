import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import PrimaryHealthCoverageDescription from '../../../components/FormDescriptions/PrimaryHealthCoverageDescription';

describe('CG <PrimaryHealthCoverageDescription>', () => {
  it('should not render any children when all props have been omitted', () => {
    const view = render(<PrimaryHealthCoverageDescription />);
    const selector = view.container.querySelector('h3');
    expect(selector).to.not.exist;
  });

  it('should render the title when provided', () => {
    const props = {
      pageTitle: 'Health care coverage',
    };
    const view = render(<PrimaryHealthCoverageDescription {...props} />);
    const selector = view.container.querySelector('h3');
    expect(selector).to.exist;
    expect(selector).to.contain.text(props.pageTitle);
  });
});
