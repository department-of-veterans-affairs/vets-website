import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import InquiriesList from '../../../components/inbox/InquiriesList';
import { categorizeByLOA } from '../../../utils/inbox';
import { mockInquiries } from '../../utils/mock-inquiries';

describe('InquiriesList', () => {
  const inquiries = categorizeByLOA(mockInquiries);

  it('only renders 4 items per page', () => {
    const view = render(
      <InquiriesList
        categoryFilter="All"
        statusFilter="All"
        inquiries={inquiries.personal}
      />,
    );

    const cards = view.getAllByTestId('inquiry-card');
    expect(cards.length).to.equal(4);
  });

  it('only renders first 4 inquiries on first page', () => {
    const view = render(
      <InquiriesList
        categoryFilter="All"
        statusFilter="All"
        inquiries={inquiries.personal}
      />,
    );
    const cardsText = view.container.textContent;

    expect(cardsText).to.contain(inquiries.personal[0].inquiryNumber);
    expect(cardsText).to.contain(inquiries.personal[1].inquiryNumber);
    expect(cardsText).to.contain(inquiries.personal[2].inquiryNumber);
    expect(cardsText).to.contain(inquiries.personal[3].inquiryNumber);
    expect(cardsText).to.not.contain(inquiries.personal[4].inquiryNumber);
  });

  it('renders an alert if no inquiries', () => {
    const view = render(
      <InquiriesList
        inquiries={[]}
        categoryFilter="All"
        statusFilter="In progress"
      />,
    );

    const vaAlert = view.getByText(/match/i);
    expect(vaAlert.textContent).to.equal(
      'No questions match your search criteria',
    );
  });
});
