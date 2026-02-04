import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import ApplicantContactInfoLoggedIn from '../../pages/applicantContactInfoLoggedIn';

describe('ApplicantContactInfoLoggedIn', () => {
  it('should render', () => {
    const props = {
      data: {
        email: 'test@example.com',
        phoneNumber: '1234567890',
      },
      goBack: () => {},
      goForward: () => {},
    };

    const wrapper = render(<ApplicantContactInfoLoggedIn {...props} />);
    expect(wrapper).to.exist;
  });

  it('should render review page view', () => {
    const props = {
      data: {
        email: 'test@example.com',
        phoneNumber: '1234567890',
      },
      onReviewPage: true,
    };

    const { getByText } = render(<ApplicantContactInfoLoggedIn {...props} />);
    expect(getByText('Contact details')).to.exist;
    expect(getByText('test@example.com')).to.exist;
    expect(getByText('123-456-7890')).to.exist;
  });
});
