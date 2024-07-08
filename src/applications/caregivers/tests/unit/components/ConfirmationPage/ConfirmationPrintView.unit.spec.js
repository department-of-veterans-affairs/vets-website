import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ConfirmationPrintView from '../../../../components/ConfirmationPage/ConfirmationPrintView';

describe('CG <ConfirmationPrintView>', () => {
  const defaultProps = {
    name: {
      first: 'John',
      middle: 'Marjorie',
      last: 'Smith',
      suffix: 'Sr.',
    },
    timestamp: undefined,
  };

  it('should render with default props', () => {
    const view = render(<ConfirmationPrintView {...defaultProps} />);
    const selectors = {
      image: view.container.querySelector('.vagov-logo'),
      title: view.container.querySelector('h1'),
      subtitles: view.container.querySelectorAll('h2'),
      veteranName: view.container.querySelector(
        '[data-testid="cg-veteranfullname"]',
      ),
    };
    expect(selectors.image).to.exist;
    expect(selectors.title).to.contain.text(
      'Apply for the Program of Comprehensive Assistance for Family Caregivers',
    );
    expect(selectors.subtitles).to.have.lengthOf(2);
    expect(selectors.veteranName).to.contain.text('John Marjorie Smith Sr.');
  });

  it('should not render timestamp in `application information` section when not provided', () => {
    const view = render(<ConfirmationPrintView {...defaultProps} />);
    const selector = view.container.querySelector(
      '[data-testid="cg-timestamp"]',
    );
    expect(selector).to.not.exist;
  });

  it('should render timestamp in `application information` section when provided', () => {
    const props = { ...defaultProps, timestamp: 1666887649663 };
    const view = render(<ConfirmationPrintView {...props} />);
    const selector = view.container.querySelector(
      '[data-testid="cg-timestamp"]',
    );
    expect(selector).to.exist;
    expect(selector).to.contain.text('Oct. 27, 2022');
  });
});
