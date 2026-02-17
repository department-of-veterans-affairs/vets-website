import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import DateReviewField from '../../../../components/FormReview/DateReviewField';

const INPUT_LABEL = 'Effective date';

describe('10-7959c <DateReviewField>', () => {
  const subject = ({ title = INPUT_LABEL, formData = '1990-01-15' } = {}) => {
    const props = { formData, uiSchema: { 'ui:title': title } };
    const { container } = render(
      <DateReviewField>
        <div {...props} />
      </DateReviewField>,
    );
    return () => ({
      dt: container.querySelector('dt'),
      dd: container.querySelector('dd'),
    });
  };

  it('should render the title from uiSchema and format a valid date string', () => {
    const selectors = subject();
    const { dd, dt } = selectors();
    expect(dt.textContent).to.equal(INPUT_LABEL);
    expect(dd.textContent).to.equal('January 15, 1990');
  });

  it('should not render a value when formData is an empty string', () => {
    const selectors = subject({ formData: '' });
    expect(selectors().dd.textContent).to.equal('');
  });

  it('should populate the "data-dd-action-name" attribute from the uiSchema', () => {
    const selectors = subject({ title: 'Test date' });
    expect(selectors().dd).to.have.attr('data-dd-action-name', 'Test date');
  });
});
