import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import EditReviewEmail from '../../components/EditReviewEmail';

const title = 'Email address';
const defaultEditButton = () => {};
const options = {
  emailAddress: 'vets.gov.user+1@gmail.com',
};
const setup = (formData = options) => {
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
  it('renders', () => {
    const { getByRole, getByText } = setup();
    getByRole('heading', { level: 4, name: title });
    getByText(options.emailAddress);
  });
  it('renders with no email address', () => {
    const { getByRole, queryByText } = setup({});
    getByRole('heading', { level: 4, name: title });
    expect(queryByText(options.emailAddress)).to.be.null;
  });
});
