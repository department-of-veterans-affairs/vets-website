import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { reviewField } from '../../content/evidenceWillUpload';

describe('reviewField', () => {
  it('should render value', () => {
    const Field = reviewField;
    const { container } = render(
      <Field>{React.createElement('div', { formData: 'yes' }, 'yes')}</Field>,
    );

    expect($('dt', container).textContent).to.contain(
      'Do you want to upload your records or other',
    );
    expect($('dd', container).textContent).to.contain('yes');
  });
  it('should render null', () => {
    const Field = reviewField;
    const { container } = render(
      <div>
        <Field />
      </div>,
    );

    expect(container.innerHTML).to.eq('<div></div>');
  });
});
