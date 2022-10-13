import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import CustomYesNoReviewField from '../../components/FormReview/CustomYesNoReviewField';

describe('hca <CustomYesNoReviewField>', () => {
  const uiSchema = {
    'ui:title': 'Review Field Title',
  };
  it('should render the field title and field value yes', () => {
    const { getByText } = render(
      <CustomYesNoReviewField>
        <div uiSchema={uiSchema} formData="Yes" />
      </CustomYesNoReviewField>,
    );

    expect(getByText(/review field title/i)).to.exist;
    expect(getByText(/yes/i)).to.exist;
  });

  it('should render the field title and field value no', () => {
    const { getByText } = render(
      <CustomYesNoReviewField>
        <div uiSchema={uiSchema} />
      </CustomYesNoReviewField>,
    );

    expect(getByText(/review field title/i)).to.exist;
    expect(getByText(/no/i)).to.exist;
  });
});
