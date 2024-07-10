import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { SIGNATURE_CERTIFICATION_STATEMENTS } from '../../../../utils/constants';
import StatementOfTruth from '../../../../components/PreSubmitInfo/StatementOfTruth';

describe('CG <StatementOfTruth>', () => {
  const defaultProps = {
    content: {
      label: 'Veteran\u2019s',
      text: SIGNATURE_CERTIFICATION_STATEMENTS.veteran,
    },
  };

  it('should render legend with provided label', () => {
    const view = render(<StatementOfTruth {...defaultProps} />);
    const selector = view.container.querySelector('.signature-box--legend');
    expect(selector).to.exist;
    expect(selector).to.contain.text('Veteran\u2019s statement of truth');
  });

  it('should render appropriate number of statements', () => {
    const view = render(<StatementOfTruth {...defaultProps} />);
    const selector = view.container.querySelectorAll(
      '[data-testid="cg-statement-copy"]',
    );
    expect(selector).to.have.lengthOf(defaultProps.content.text.length);
  });

  it('should render privacy statement', () => {
    const view = render(<StatementOfTruth {...defaultProps} />);
    const selector = view.container.querySelector(
      '[data-testid="cg-privacy-copy"]',
    );
    expect(selector).to.contain.text(
      'I have read and accept the privacy policy.',
    );
  });
});
