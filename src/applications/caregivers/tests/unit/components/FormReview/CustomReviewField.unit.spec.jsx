import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import CustomReviewField from '../../../../components/FormReview/CustomReviewField';

describe('CG <CustomReviewField>', () => {
  const uiTitle = 'Review Field Title';
  const subject = ({ formData }) => {
    const props = {
      uiSchema: { 'ui:title': uiTitle },
      formData,
    };
    const { container } = render(
      <CustomReviewField>
        <div {...props} />
      </CustomReviewField>,
    );
    const selectors = () => ({
      title: container.querySelector('dt', '.review-row'),
      value: container.querySelector('dd', '.review-row'),
    });
    return { selectors };
  };

  it('should render the correct field title & value', () => {
    const formData = 'Some input data';
    const { selectors } = subject({ formData });
    const { title, value } = selectors();
    expect(title).to.contain.text(uiTitle);
    expect(value).to.contain.text(formData);
  });
});
