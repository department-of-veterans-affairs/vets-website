import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { SIGNATURE_CERTIFICATION_STATEMENTS } from '../../../../utils/constants';
import StatementOfTruth from '../../../../components/PreSubmitInfo/StatementOfTruth';

describe('CG <StatementOfTruth>', () => {
  const getData = ({ label = undefined, text = undefined }) => ({
    props: { content: { label, text } },
  });
  const subject = ({ props }) => {
    const { container } = render(<StatementOfTruth {...props} />);
    const selectors = () => ({
      legend: container.querySelector('.signature-box--legend'),
      statements: container.querySelectorAll(
        '[data-testid="cg-statement-copy"]',
      ),
    });
    return { container, selectors };
  };

  it('should render the appropriate content when the props are fully provided', () => {
    const { props } = getData({
      label: 'Veteran\u2019s',
      text: SIGNATURE_CERTIFICATION_STATEMENTS.veteran,
    });
    const { selectors } = subject({ props });
    expect(selectors().legend).to.contain.text(
      'Veteran\u2019s statement of truth',
    );
    expect(selectors().statements).to.have.lengthOf(props.content.text.length);
  });

  it('should gracefully render when the props are absent', () => {
    const { props } = getData({});
    const { selectors } = subject({ props });
    expect(selectors().statements).to.have.lengthOf(0);
  });
});
