import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { render, cleanup, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { UPDATED_USER_MOCK_DATA } from '../../constants/mockData';
import PreviousEnrollmentVerifications from '../../components/PreviousEnrollmentVerifications';

const mockStore = configureStore([]);
describe('PreviousEnrollmentVerifications', () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      personalInfo: { name: 'John Doe' },
    });
  });
  afterEach(() => {
    cleanup();
  });

  it('should render', () => {
    const { container } = render(
      <Provider store={store}>
        <PreviousEnrollmentVerifications
          enrollmentData={UPDATED_USER_MOCK_DATA['vye::UserInfo']}
        />
      </Provider>,
    );
    expect(container).to.be.ok;
  });

  it('should render with mock enrollment data', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <PreviousEnrollmentVerifications
          enrollmentData={UPDATED_USER_MOCK_DATA['vye::UserInfo']}
        />
      </Provider>,
    );

    // added to hopefully address flaky test issues
    // test should wait for data to laod before assertion
    await waitFor(() => {
      // testing block that hasn't been verified
      expect(getByText('March 2024')).to.exist;
      // testing block that has been verified
      expect(getByText('May 2020')).to.exist;
    });
  });

  it('Ensure text from "What if I notice..." additional info component is displayed', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <PreviousEnrollmentVerifications
          enrollmentData={UPDATED_USER_MOCK_DATA['vye::UserInfo']}
        />
      </Provider>,
    );
    await waitFor(() => {
      const additionalInfoText =
        'Work with your School Certifying Official (SCO) to make sure they have the correct enrollment information and can update the information on file.';
      expect(getByText(additionalInfoText)).to.exist;
    });
  });

  it('simulates page change in VaPagination to page 2', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <PreviousEnrollmentVerifications
          enrollmentData={UPDATED_USER_MOCK_DATA['vye::UserInfo']}
        />
      </Provider>,
    );

    const newPage = 2;
    const pagination = wrapper.find('VaPagination');
    pagination.props().onPageSelect({ detail: { page: newPage } });

    // update after page change
    wrapper.update();

    // added to hopefully address flaky test issues
    // test should wait for previous update before testing the
    // assertion
    await waitFor(() => {
      // Find the <p> element by its ID
      const pElement = wrapper.find('#vye-pagination-page-status-text');

      // Get the text content of the element
      const textContent = pElement.text();

      expect(textContent).to.equal(
        'Showing 7 - 12 of 14 monthly enrollments listed by most recent',
      );
    });
    wrapper.unmount();
  });

  it('simulates page change in VaPagination to last page', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <PreviousEnrollmentVerifications
          enrollmentData={UPDATED_USER_MOCK_DATA['vye::UserInfo']}
        />
      </Provider>,
    );

    const newPage = 3;
    const pagination = wrapper.find('VaPagination');
    pagination.props().onPageSelect({ detail: { page: newPage } });

    // update after page change
    wrapper.update();

    // added to hopefully address flaky test issues
    // test should wait for previous update before testing the
    // assertion
    await waitFor(() => {
      // Find the <p> element by its ID
      const pElement = wrapper.find('#vye-pagination-page-status-text');

      // Get the text content of the element
      const textContent = pElement.text();

      expect(textContent).to.equal(
        'Showing 13 - 14 of 14 monthly enrollments listed by most recent',
      );
    });

    wrapper.unmount();
  });
  it('should show "You currently have no enrollments to verify." message is user is new', () => {
    const enrollmentData = {
      ...UPDATED_USER_MOCK_DATA['vye::UserInfo'],
      pendingVerifications: [],
      verifications: [],
    };
    const { getByText } = render(
      <Provider store={store}>
        <PreviousEnrollmentVerifications enrollmentData={enrollmentData} />
      </Provider>,
    );
    const noEnrollments = getByText(
      'You currently have no enrollments to verify.',
    );
    expect(noEnrollments).to.exist;
  });
});
