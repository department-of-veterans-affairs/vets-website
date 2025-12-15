import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { content, reviewField } from '../../content/notice5103';

describe('notice5103 content', () => {
  describe('reviewField', () => {
    it('should render "yes" value', () => {
      const Field = reviewField;
      const { container } = render(
        <Field>{React.createElement('div', { formData: true })}</Field>,
      );

      expect($('dt', container).textContent).to.eq(content.label);
      expect($('dd', container).textContent).to.eq('Yes, I certify');
    });

    it('should render "no" value', () => {
      const Field = reviewField;
      const { container } = render(
        <Field>{React.createElement('div', { formData: false })}</Field>,
      );

      expect($('dt', container).textContent).to.eq(content.label);
      expect($('dd', container).textContent).to.eq('No, I didn’t certify');
    });
  });
});
