import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ConfirmationPrintView from '../../../../components/ConfirmationPage/ConfirmationPrintView';

describe('CG <ConfirmationPrintView>', () => {
  const subject = ({ timestamp = undefined } = {}) => {
    const props = {
      name: { first: 'John', middle: 'Marjorie', last: 'Smith', suffix: 'Sr.' },
      timestamp,
    };
    const { container } = render(<ConfirmationPrintView {...props} />);
    const selectors = () => ({
      veteranName: container.querySelector(
        '[data-testid="cg-veteranfullname"]',
      ),
      submissionDate: container.querySelector('[data-testid="cg-timestamp"]'),
    });
    return { selectors };
  };

  it('should render the appropriate Veteran name', () => {
    const { selectors } = subject();
    const { veteranName } = selectors();
    expect(veteranName).to.contain.text('John Marjorie Smith Sr.');
  });

  it('should not render timestamp in `application information` section when not provided', () => {
    const { selectors } = subject();
    const { submissionDate } = selectors();
    expect(submissionDate).to.not.exist;
  });

  it('should render timestamp in `application information` section when provided', () => {
    const { selectors } = subject({ timestamp: 1666887649663 });
    const { submissionDate } = selectors();
    expect(submissionDate).to.contain.text('Oct. 27, 2022');
  });
});
