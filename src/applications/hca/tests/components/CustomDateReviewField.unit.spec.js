import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import CustomDateReviewField from '../../components/FormReview/CustomDateReviewField';
import medicarePartAEffectiveDate from '../../config/chapters/insuranceInformation/medicarePartAEffectiveDate';

describe('hca <CustomDateReviewField>', () => {
  it('should render the field title and field date', () => {
    const formData = new Date('2020-5-15');
    const { uiSchema } = medicarePartAEffectiveDate;

    const { getByText } = render(
      <CustomDateReviewField>
        <React.Fragment
          uiSchema={uiSchema.medicarePartAEffectiveDate}
          formData={formData}
        />
      </CustomDateReviewField>,
    );

    expect(getByText(/what is your medicare part A effective date/i)).to.exist;
    expect(getByText('05/15/2020')).to.exist;
  });
});
