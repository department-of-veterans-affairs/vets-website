import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import {
  homelessRiskTitle,
  homelessReviewField,
} from '../../../shared/content/homeless';

describe('reviewField', () => {
  it('should render value', () => {
    const Field = homelessReviewField;
    const { container } = render(
      <Field>
        <div>yes</div>
      </Field>,
    );

    expect($('dt', container).textContent).to.contain(homelessRiskTitle);
    expect($('dd', container).textContent).to.contain('yes');
  });
  it('should render null', () => {
    const Field = homelessReviewField;
    const { container } = render(<Field />);

    expect($('dd', container).textContent).to.eq('');
  });
});
