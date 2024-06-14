import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import ConfirmationScreenView from '../../../components/ConfirmationPage/ConfirmationScreenView';

describe('CG <ConfirmationScreenView>', () => {
  const defaultProps = {
    name: {
      first: 'John',
      middle: 'Marjorie',
      last: 'Smith',
      suffix: 'Sr.',
    },
    form: {
      submission: {
        response: undefined,
        timestamp: undefined,
      },
      data: { veteranFullName: {} },
    },
    timestamp: undefined,
  };

  it('should render with default props', () => {
    const { container } = render(<ConfirmationScreenView {...defaultProps} />);
    const selectors = {
      subtitles: container.querySelectorAll('h2, h3'),
      veteranName: container.querySelector(
        '[data-testid="cg-veteran-fullname"]',
      ),
      download: container.querySelector('.caregiver-application--download'),
    };
    expect(selectors.subtitles).to.have.lengthOf(2);
    expect(selectors.subtitles[0]).to.contain.text(
      'Thank you for completing your application',
    );
    expect(selectors.subtitles[1]).to.contain.text(
      'Your application information',
    );
    expect(selectors.veteranName).to.contain.text('John Marjorie Smith Sr.');
    expect(selectors.download).to.not.be.empty;
  });

  it('should not render timestamp in `application information` section when not provided', () => {
    const { container } = render(<ConfirmationScreenView {...defaultProps} />);
    const selector = container.querySelector(
      '[data-testid="cg-submission-date"]',
    );
    expect(selector).to.not.exist;
  });

  it('should render timestamp in `application information` section when provided', () => {
    const props = { ...defaultProps, timestamp: 1666887649663 };
    const { container } = render(<ConfirmationScreenView {...props} />);
    const selector = container.querySelector(
      '[data-testid="cg-submission-date"]',
    );
    expect(selector).to.exist;
    expect(selector).to.contain.text('Oct. 27, 2022');
  });

  it('should render application print button', () => {
    const { container } = render(<ConfirmationScreenView {...defaultProps} />);
    const selector = container.querySelector('[data-testid="cg-print-button"]');
    expect(selector).to.exist;
    expect(selector).to.have.attribute('text', 'Print this page');
  });

  it('should fire `window.print` function when the print button is clicked', () => {
    const printSpy = sinon.spy(window, 'print');
    const { container } = render(<ConfirmationScreenView {...defaultProps} />);
    const selector = container.querySelector('[data-testid="cg-print-button"]');
    fireEvent.click(selector);
    expect(printSpy.called).to.be.true;
  });
});
