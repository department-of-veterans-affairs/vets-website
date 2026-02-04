import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import OMBInfo from '../../components/OMBInfo';

describe('<OMBInfo/>', () => {
  it('should contain the correct text', () => {
    const { container } = render(<OMBInfo />);

    expect(container.textContent).to.contain('Respondent burden: 20');
    expect(container.textContent).to.contain('2900-0853');
    expect(container.textContent).to.contain('08/31/2025');
  });
});
