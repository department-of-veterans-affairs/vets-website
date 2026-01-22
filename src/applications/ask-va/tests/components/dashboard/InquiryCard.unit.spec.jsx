import { render } from '@testing-library/react';
import React from 'react';
import { expect } from 'chai';
import InquiryCard from '../../../components/dashboard/InquiryCard';

describe('InquiryCard', () => {
  it('renders inquiry details accurately', () => {
    const exampleInquiry = {
      status: 'In Progress',
      createdOn: '12/19/2024 5:30:28 PM',
      lastUpdate: '12/22/2024 12:00:00 AM',
      inquiryNumber: 'A-1234',
      categoryName: 'Housing',
      submitterQuestion:
        "I'd like to get some support with a question I have about housing.",
    };

    const view = render(<InquiryCard inquiry={exampleInquiry} />);

    const status = view.getByRole('heading', {
      level: 3,
      name: /in progress/i,
    });
    const dateSubmitted = view.getByRole('heading', {
      level: 3,
      name: /dec 19, 2024/i,
    });
    const dateLastUpdated = view.getByText(/dec 22, 2024/i);
    const refNumber = view.getByText(exampleInquiry.inquiryNumber);
    const category = view.getByText(exampleInquiry.categoryName);
    const originalQuestion = view.getByText(exampleInquiry.submitterQuestion);

    expect(status).to.exist;
    expect(dateSubmitted).to.exist;
    expect(dateLastUpdated).to.exist;
    expect(refNumber).to.exist;
    expect(category).to.exist;
    expect(originalQuestion).to.exist;
  });
});
