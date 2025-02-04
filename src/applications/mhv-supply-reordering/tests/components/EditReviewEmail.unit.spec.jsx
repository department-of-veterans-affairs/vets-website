import React from 'react';
import { render } from '@testing-library/react';

import EditReviewEmail from '../../components/EditReviewEmail';

const title = 'Email address';
const defaultEditButton = () => {};
const formData = {
  emailAddress: 'vets.gov.user+1@gmail.com',
};
const setup = () => {
  return render(
    <div>
      <EditReviewEmail
        formData={formData}
        title={title}
        defaultEditButton={defaultEditButton}
      />
    </div>,
  );
};

describe('EditReviewEmail', () => {
  it('renders EditReviewEmail', () => {
    const { getByRole, getByText } = setup();
    getByRole('heading', { level: 4, name: title });
    getByText(formData.emailAddress);
  });
});
