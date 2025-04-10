import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import CustomYesNoReviewField from '../../../../components/FormReview/CustomYesNoReviewField';

describe('CG <CustomYesNoReviewField>', () => {
  const uiTitle = 'Review Field Title';
  const subject = ({ formData }) => {
    const props = {
      uiSchema: { 'ui:title': uiTitle },
      formData,
    };
    const { container } = render(
      <CustomYesNoReviewField>
        <div {...props} />
      </CustomYesNoReviewField>,
    );
    const selectors = () => ({
      title: container.querySelector('dt', '.review-row'),
      value: container.querySelector('dd', '.review-row'),
    });
    return { selectors };
  };

  it('should render the correct field title & value when the component renders with value of `Yes`', () => {
    const { selectors } = subject({ formData: true });
    const { title, value } = selectors();
    expect(title).to.contain.text(uiTitle);
    expect(value).to.contain.text('Yes');
  });

  it('should render the correct field title & value when the component renders with value of `No`', () => {
    const { selectors } = subject({ formData: false });
    const { title, value } = selectors();
    expect(title).to.contain.text(uiTitle);
    expect(value).to.contain.text('No');
  });
});
