import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { STATEMENTS } from '../../../../components/PreSubmitInfo';
import StatementOfTruth from '../../../../components/PreSubmitInfo/StatementOfTruth';

describe('CG <StatementOfTruth>', () => {
  const subject = ({ label = undefined, text = undefined } = {}) => {
    const props = { content: { label, text } };
    const { container } = render(<StatementOfTruth {...props} />);
    const selectors = () => ({
      legend: container.querySelector('.signature-box--legend'),
      statements: container.querySelectorAll(
        '[data-testid="cg-statement-copy"]',
      ),
    });
    return { selectors };
  };

  it('should render the appropriate content when the props are fully provided', () => {
    const text = STATEMENTS.veteran;
    const { selectors } = subject({ label: 'Veteran\u2019s', text });
    const { legend, statements } = selectors();
    expect(legend).to.contain.text('Veteran\u2019s statement of truth');
    expect(statements).to.have.lengthOf(text.length);
  });

  it('should gracefully render when the props are absent', () => {
    const { selectors } = subject();
    expect(selectors().statements).to.have.lengthOf(0);
  });
});
