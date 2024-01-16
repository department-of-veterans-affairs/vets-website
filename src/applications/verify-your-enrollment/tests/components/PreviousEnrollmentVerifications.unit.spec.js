import React from 'react';
import { expect } from 'chai';
// import { mount } from 'enzyme';
import { render, cleanup } from '@testing-library/react';
import {
  USER_MOCK_DATA,
  USER_PENDINGVERIFICATION_MOCK_DATA,
} from '../../constants/mockData';
import PreviousEnrollmentVerifications from '../../components/PreviousEnrollmentVerifications';

describe('PreviousEnrollmentVerifications', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render', () => {
    const { container } = render(
      <PreviousEnrollmentVerifications enrollmentData={USER_MOCK_DATA} />,
    );
    expect(container).to.be.ok;
  });

  it('should render with mock enrollment data', () => {
    const { getByText } = render(
      <PreviousEnrollmentVerifications enrollmentData={USER_MOCK_DATA} />,
    );

    // testing block that hasn't been verified
    expect(getByText('February 2025')).to.exist;
    // testing blovk that has been verified
    expect(getByText('September 2024 Verified')).to.exist;
  });

  it('should render with mock enrollment data with pending verified data', () => {
    const { getByText } = render(
      <PreviousEnrollmentVerifications
        enrollmentData={USER_PENDINGVERIFICATION_MOCK_DATA}
      />,
    );

    // testing block that has been verified but still pending processing
    expect(getByText('February 2025 Verified')).to.exist;
    // testing blovk that has been verified
    expect(getByText('September 2024 Verified')).to.exist;
  });

  it('Ensure text from "What if I notice..." additional info component is displayed', () => {
    const { getByText } = render(
      <PreviousEnrollmentVerifications enrollmentData={USER_MOCK_DATA} />,
    );

    const additionalInfoText =
      'Work with your School Certifying Official (SCO) to make sure they have the correct enrollment information and can update the information on file.';
    expect(getByText(additionalInfoText)).to.exist;
  });

  // it('simulates page change in VaPagination to page 2', () => {
  //   const wrapper = mount(
  //     <PreviousEnrollmentVerifications enrollmentData={USER_MOCK_DATA} />,
  //   );

  //   const newPage = 2;
  //   const pagination = wrapper.find('VaPagination');
  //   pagination.props().onPageSelect({ detail: { page: newPage } });

  //   // update after page change
  //   wrapper.update();

  //   // Find the <p> element by its ID
  //   const pElement = wrapper.find('#vye-pagination-page-status-text');

  //   // Get the text content of the element
  //   const textContent = pElement.text();

  //   expect(textContent).to.equal(
  //     'Showing 7-12 of 14 monthly enrollments listed by most recent',
  //   );
  //   wrapper.unmount();
  // });

  // it('simulates page change in VaPagination to last page', () => {
  //   const wrapper = mount(
  //     <PreviousEnrollmentVerifications enrollmentData={USER_MOCK_DATA} />,
  //   );

  //   const newPage = 3;
  //   const pagination = wrapper.find('VaPagination');
  //   pagination.props().onPageSelect({ detail: { page: newPage } });

  //   // update after page change
  //   wrapper.update();

  //   // Find the <p> element by its ID
  //   const pElement = wrapper.find('#vye-pagination-page-status-text');

  //   // Get the text content of the element
  //   const textContent = pElement.text();

  //   expect(textContent).to.equal(
  //     'Showing 13-14 of 14 monthly enrollments listed by most recent',
  //   );
  //   wrapper.unmount();
  // });
});
