import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import InboxLayoutOld from '~/applications/ask-va/components/inbox/InboxLayoutOld';
import { standardizeInquiries } from '~/applications/ask-va/utils/inbox';
import { expect } from 'chai';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { mockInquiries as rawInquiries } from '../../utils/mock-inquiries';

describe('<InboxLayoutOld />', () => {
  const mockData = standardizeInquiries(rawInquiries);
  const personalInquiries = mockData.standardInquiries.filter(
    inq => inq.levelOfAuthentication.toLowerCase() === 'personal',
  );
  const selectedStatus = 'In progress';

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

  it('displays a message when there are no inquiries', () => {
    const { view } = renderWithStore(
      <InboxLayoutOld
        categoryOptions={mockData.uniqueCategories}
        statusOptions={mockData.uniqueStatuses}
        inquiryTypes={[]}
        inquiries={[]}
      />,
    );

    const emptyInboxAlert = view.getByText(
      'You haven’t submitted a question yet.',
    );
    const inquiryResult = view.queryByTestId('inquiry-card');
    expect(emptyInboxAlert).to.exist;
    expect(inquiryResult).to.not.exist;
  });

  it('renders a list of inquiries', () => {
    const { view } = renderWithStore(
      <InboxLayoutOld
        categoryOptions={mockData.uniqueCategories}
        statusOptions={mockData.uniqueStatuses}
        inquiryTypes={['personal']}
        inquiries={personalInquiries}
      />,
    );

    const inquiryResults = view.getAllByTestId('inquiry-card');
    expect(inquiryResults.length).to.be.greaterThanOrEqual(1);
  });

  it('only renders filter options available in the list', () => {
    const { view } = renderWithStore(
      <InboxLayoutOld
        categoryOptions={mockData.uniqueCategories}
        statusOptions={mockData.uniqueStatuses}
        inquiryTypes={['personal']}
        inquiries={personalInquiries}
      />,
    );

    const allOptions = view.getAllByRole('option');
    const visibleCategories = allOptions
      .filter(option => option.parentElement.name === 'category')
      .map(option => option.textContent);
    const visibleStatuses = allOptions
      .filter(option => option.parentElement.name === 'status')
      .map(option => option.textContent);

    expect(visibleCategories).to.eql(['All', ...mockData.uniqueCategories]);
    expect(visibleStatuses).to.eql(['All', ...mockData.uniqueStatuses]);
  });

  it('applies and clears a filter', () => {
    const { view } = renderWithStore(
      <InboxLayoutOld
        categoryOptions={mockData.uniqueCategories}
        statusOptions={mockData.uniqueStatuses}
        inquiryTypes={['personal']}
        inquiries={personalInquiries}
      />,
    );

    // Confirm filter's starting value and list's variety
    const statusSelect = view.container.querySelector(
      'va-select[name="status"]',
    );
    expect(statusSelect.getAttribute('value')).to.equal('All');

    const startingResults = view.getAllByTestId('inquiry-card');
    expect(
      startingResults.every(a =>
        a.textContent.includes(`Status ${selectedStatus}`),
      ),
    ).to.be.false;

    // Set status filter to "In progress" and apply filters
    statusSelect.__events.vaSelect({
      target: { value: selectedStatus },
    });
    expect(statusSelect.getAttribute('value')).to.equal(selectedStatus);

    const buttonPair = view.container.querySelector('va-button-pair');
    buttonPair.__events.primaryClick();

    // Confirm only selected status is present
    const filteredResults = view.getAllByTestId('inquiry-card');
    expect(
      filteredResults.every(a =>
        a.textContent.includes(`Status ${selectedStatus}`),
      ),
    ).to.be.true;

    // Reset filters & list, confirm it matches starting state
    buttonPair.__events.secondaryClick();
    const endingResults = view.getAllByTestId('inquiry-card');
    const endTextContent = endingResults.map(end => end.textContent);
    const startTextContent = startingResults.map(start => start.textContent);
    const filteredTextContent = filteredResults.map(
      filtered => filtered.textContent,
    );

    expect(statusSelect.getAttribute('value')).to.equal('All');

    expect(endTextContent)
      .to.eql(startTextContent)
      .but.not.eql(filteredTextContent);
  });

  it('shifts focus to search description after a button is clicked', () => {
    const { view } = renderWithStore(
      <InboxLayoutOld
        categoryOptions={mockData.uniqueCategories}
        statusOptions={mockData.uniqueStatuses}
        inquiryTypes={['personal']}
        inquiries={personalInquiries}
      />,
    );

    // Apply filters
    const statusSelect = view.container.querySelector(
      'va-select[name="status"]',
    );
    statusSelect.__events.vaSelect({
      target: { value: selectedStatus },
    });
    const buttonPair = view.container.querySelector('va-button-pair');
    buttonPair.__events.primaryClick();

    const focusedElement = view.container.ownerDocument.activeElement;
    const searchDescription = view.getByText(/showing/i);

    expect(focusedElement).to.equal(searchDescription.parentElement);
  });

  it('searches results based on a query', () => {
    // Add an inquiry with a reference number guaranteed to be different
    const inquiriesCopy = [...personalInquiries];
    const newItem = {
      ...inquiriesCopy[inquiriesCopy.length - 1],
      inquiryNumber: 'A-3',
    };
    inquiriesCopy.push(newItem);

    const { view } = renderWithStore(
      <InboxLayoutOld
        categoryOptions={mockData.uniqueCategories}
        statusOptions={mockData.uniqueStatuses}
        inquiryTypes={['personal']}
        inquiries={inquiriesCopy}
      />,
    );

    // Confirm starting state
    const startingResults = view.getAllByTestId('inquiry-card');
    expect(startingResults.length).to.equal(6);
    expect(startingResults[0].textContent).to.include('Reference number: A-2');

    const searchBox = view.container.querySelector('va-text-input');
    expect(searchBox.value).to.equal('');

    // Input a search query and apply
    searchBox.__events.vaInput({ target: { value: 'A-3' } });
    expect(searchBox.value).to.equal('A-3');
    const buttonPair = view.container.querySelector('va-button-pair');
    buttonPair.__events.primaryClick();

    // Confirm the list is now just one desired result
    const endingResults = view.getAllByTestId('inquiry-card');
    expect(endingResults.length).to.equal(1);
    expect(endingResults[0].textContent).to.include('Reference number: A-3');
  });

  describe('business and personal tabs', () => {
    it('hides tabs when there are no business inquiries', () => {
      const { view } = renderWithStore(
        <InboxLayoutOld
          categoryOptions={mockData.uniqueCategories}
          statusOptions={mockData.uniqueStatuses}
          inquiryTypes={['personal']}
          inquiries={personalInquiries}
        />,
      );

      expect(view.queryByRole('tab')).to.not.exist;
    });

    it('shows tabs when there are business inquiries', () => {
      const { view } = renderWithStore(
        <InboxLayoutOld
          categoryOptions={mockData.uniqueCategories}
          statusOptions={mockData.uniqueStatuses}
          inquiryTypes={mockData.types}
          inquiries={mockData.standardInquiries}
        />,
      );

      const tabButtons = view.getByRole('tablist');
      const businessTab = view.getByRole('tab', {
        name: /business/i,
      });
      const personalTab = view.getByRole('tab', {
        name: /personal/i,
      });

      expect(tabButtons.childNodes.length).to.equal(2);
      expect(businessTab).to.exist;
      expect(personalTab).to.exist;
    });

    it('switches list content based on the selected tab', () => {
      const { view } = renderWithStore(
        <InboxLayoutOld
          categoryOptions={mockData.uniqueCategories}
          statusOptions={mockData.uniqueStatuses}
          inquiryTypes={mockData.types}
          inquiries={mockData.standardInquiries}
        />,
      );

      // Confirm starting state
      const businessTab = view.getByRole('tab', {
        name: /business/i,
      });
      const personalTab = view.getByRole('tab', {
        name: /personal/i,
      });

      const businessResults = view.getAllByTestId('inquiry-card');
      expect(businessTab.getAttribute('aria-selected')).to.equal('true');
      expect(personalTab.getAttribute('aria-selected')).to.equal('false');
      expect(businessResults[0].textContent).to.include('Category: Education');

      fireEvent.click(personalTab);

      // Confirm content switched with tabs
      const personalResults = view.getAllByTestId('inquiry-card');
      expect(businessTab.getAttribute('aria-selected')).to.equal('false');
      expect(personalTab.getAttribute('aria-selected')).to.equal('true');
      expect(personalResults[0].textContent).to.not.include(
        'Category: Education',
      );
    });
  });
});
