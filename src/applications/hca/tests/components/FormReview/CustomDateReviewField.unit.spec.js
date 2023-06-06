import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import CustomDateReviewField from '../../../components/FormReview/CustomDateReviewField';

describe('hca <CustomDateReviewField>', () => {
  it('should render the field title and field date', () => {
    const uiSchema = {
      'ui:title': 'Review Field Title',
    };
    const formData = new Date('2020-5-15');

    const { getByText } = render(
      <CustomDateReviewField>
        <div uiSchema={uiSchema} formData={formData} />
      </CustomDateReviewField>,
    );

    expect(getByText(/review field title/i)).to.exist;
    expect(getByText('05/15/2020')).to.exist;
  });
});
