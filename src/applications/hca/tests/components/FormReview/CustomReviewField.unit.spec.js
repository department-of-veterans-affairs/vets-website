import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import CustomReviewField from '../../../components/FormReview/CustomReviewField';

describe('hca <CustomReviewField>', () => {
  it('should render the field title and field value', () => {
    const uiSchema = {
      'ui:title': 'Review Field Title',
    };
    const formData = 'field value';

    const { getByText } = render(
      <CustomReviewField>
        <div uiSchema={uiSchema} formData={formData} />
      </CustomReviewField>,
    );

    expect(getByText(/review field title/i)).to.exist;
    expect(getByText(/field value/i)).to.exist;
  });
});
