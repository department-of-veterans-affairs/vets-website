import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import InquiriesList from '../../../components/dashboard/InquiriesList';
import { categorizeByLOA } from '../../../utils/dashboard';
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

    const cards = view.getAllByTestId('dashboard-card');
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

  it('Calculates the correct props for FilterSummary with NO tabs', () => {
    const sentence =
      'Showing 1-4 of 7 results for "All" statuses and "All" categories';

    const view = render(
      <InquiriesList
        categoryFilter="All"
        statusFilter="All"
        inquiries={inquiries.personal}
      />,
    );

    const heading = view.getByRole('heading', {
      level: 3,
      name: /showing/i,
    });
    expect(heading.textContent).to.equal(sentence);
  });

  it('Calculates the correct props for FilterSummary with tabs', () => {
    const sentence =
      'Showing 1-4 of 7 results for "All" statuses and "All" categories in "Personal"';

    const view = render(
      <InquiriesList
        categoryFilter="All"
        statusFilter="All"
        inquiries={inquiries.personal}
        tabName="Personal"
      />,
    );

    const heading = view.getByRole('heading', {
      level: 3,
      name: /showing/i,
    });
    expect(heading.textContent).to.equal(sentence);
  });

  it('renders an alert if no inquiries', () => {
    const view = render(
      <InquiriesList
        inquiries={[]}
        categoryFilter="All"
        statusFilter="In progress"
      />,
    );

    const filterSummary = view.getByText(/results/i);
    expect(filterSummary.textContent).to.equal(
      'Showing no results for "In progress" status and "All" categories',
    );
  });
});
