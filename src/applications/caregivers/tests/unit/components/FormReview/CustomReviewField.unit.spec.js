import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import CustomReviewField from '../../../../components/FormReview/CustomReviewField';

describe('CG <CustomReviewField>', () => {
  const getData = ({ formData }) => ({
    props: {
      uiSchema: { 'ui:title': 'Review Field Title' },
      formData,
    },
  });
  const subject = ({ props }) => {
    const { container } = render(
      <CustomReviewField>
        <div {...props} />
      </CustomReviewField>,
    );
    const selectors = () => ({
      title: container.querySelector('dt', '.review-row'),
      value: container.querySelector('dd', '.review-row'),
    });
    return { container, selectors };
  };

  it('should render the correct field title & value', () => {
    const formData = 'Some input data';
    const { props } = getData({ formData });
    const { selectors } = subject({ props });
    expect(selectors().title).to.contain.text(props.uiSchema['ui:title']);
    expect(selectors().value).to.contain.text(formData);
  });
});
