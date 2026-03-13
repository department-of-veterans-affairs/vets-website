import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import InquiriesList from '../../../components/inbox/InquiriesList';
import { standardizeInquiries } from '../../../utils/inbox';
import { mockInquiries as rawInquiries } from '../../utils/mock-inquiries';

describe('InquiriesList', () => {
  const mockData = standardizeInquiries(rawInquiries);
  const personalInquiries = mockData.standardInquiries.filter(
    inq => inq.levelOfAuthentication.toLowerCase() === 'personal',
  );

  function setupStore(initialState) {
    return configureStore({
      reducer: state => state,
      preloadedState: { ...initialState, askVA: {} },
    });
  }

  // TODO delete after new inbox goes live
  function renderWithStore(children) {
    const store = setupStore({});
    return {
      store,
      view: render(<Provider store={store}>{children}</Provider>),
    };
  }

  it('only renders 6 items per page', () => {
    const { view } = renderWithStore(
      <InquiriesList
        categoryFilter="All"
        statusFilter="All"
        inquiries={personalInquiries}
      />,
    );

    const cards = view.getAllByTestId('inquiry-card');
    expect(cards.length).to.equal(6);
  });

  it('renders first 6 inquiries on first page', () => {
    const { view } = renderWithStore(
      <InquiriesList
        categoryFilter="All"
        statusFilter="All"
        inquiries={personalInquiries}
      />,
    );
    const pageText = view.container.textContent;

    expect(pageText).to.contain(personalInquiries[0].inquiryNumber);
    expect(pageText).to.contain(personalInquiries[1].inquiryNumber);
    expect(pageText).to.contain(personalInquiries[2].inquiryNumber);
    expect(pageText).to.contain(personalInquiries[3].inquiryNumber);
    expect(pageText).to.contain(personalInquiries[4].inquiryNumber);
    expect(pageText).to.contain(personalInquiries[5].inquiryNumber);
    expect(pageText).to.not.contain(personalInquiries[6].inquiryNumber);
  });

  it('renders an alert if inquiries array is empty', () => {
    const { view } = renderWithStore(
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

  it('updates results based on pagination', () => {
    const { view } = renderWithStore(
      <InquiriesList
        categoryFilter="All"
        statusFilter="All"
        inquiries={personalInquiries}
      />,
    );

    // Confirm starting state
    const firstPageFirstNumber = personalInquiries[0].inquiryNumber;
    const secondPageFirstNumber = personalInquiries[6].inquiryNumber;
    const pagination = view.container.querySelector('va-pagination');

    expect(view.getByText(firstPageFirstNumber)).to.exist;
    expect(view.queryByText(secondPageFirstNumber)).to.not.exist;
    expect(pagination.getAttribute('page')).to.equal('1');

    // Simulate clicking to page 2
    pagination.__events.pageSelect({ detail: { page: 2 } });

    // Confirm page updated
    expect(pagination.getAttribute('page')).to.equal('2');
    expect(view.getByText(secondPageFirstNumber)).to.exist;
    expect(view.queryByText(firstPageFirstNumber)).to.not.exist;
  });
});
