import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { homelessReviewField } from '../../content/homeless';

describe('reviewField', () => {
  it('should render value', () => {
    const Field = homelessReviewField;
    const { container } = render(
      <Field>{React.createElement('div', { formData: 'yes' }, 'yes')}</Field>,
    );

    expect($('dt', container).textContent).to.contain(
      'Are you experiencing homelessness?',
    );
    expect($('dd', container).textContent).to.contain('yes');
  });
  it('should render null', () => {
    const Field = homelessReviewField;
    const { container } = render(
      <div>
        <Field />
      </div>,
    );

    expect($('dd', container).textContent).to.eq('');
  });
});
