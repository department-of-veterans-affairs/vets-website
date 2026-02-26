import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import SpouseMarriageTitle from '../../../components/SpouseMarriageTitle';

describe('Pensions SpouseMarriageTitle', () => {
  it('should render single marriage title', () => {
    const { container } = render(
      <SpouseMarriageTitle id="id" formData={{ spouseMarriages: [{}] }} />,
    );

    const text = container.textContent;
    expect(text).to.contain('former marriage');
  });
  it('should render multi-marriage title', () => {
    const { container } = render(
      <SpouseMarriageTitle id="id" formData={{ spouseMarriages: [{}, {}] }} />,
    );

    const text = container.textContent;
    expect(text).to.contain('former marriages');
  });
});
