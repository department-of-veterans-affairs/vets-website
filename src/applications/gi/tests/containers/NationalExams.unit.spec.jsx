import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import NationalExamsList from '../../containers/NationalExamsList';

describe('NationalExamsList', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<NationalExamsList />);
  });

  it('should render without crashing', () => {
    expect(wrapper.exists()).to.be.true;
  });

  it('should render the VaPagination component', () => {
    expect(wrapper.find(VaPagination).length).to.equal(1);
  });

  it('should render the correct number of exams for the first page', () => {
    const examItems = wrapper.find('va-accordion-item');
    expect(examItems.length).to.equal(5); // Check if it renders 5 items for the first page
  });

  it('should have the correct initial state for currentPage', () => {
    expect(wrapper.find(VaPagination).props().page).to.equal(1); // Verify currentPage prop
  });

  it('should calculate the correct total number of pages', () => {
    const totalPages = wrapper.find(VaPagination).props().pages;
    expect(totalPages).to.equal(3); // 12 exams / 5 items per page = 3 pages
  });

  it('should update currentPage when handlePageChange is called', () => {
    wrapper
      .find(VaPagination)
      .props()
      .onPageSelect({ detail: { page: 2 } });
    expect(wrapper.find(VaPagination).props().page).to.equal(2); // Check if page changes to 2
  });

  it('should render the correct institution name', () => {
    const institutionName = wrapper
      .find('.provider-info-container span')
      .first()
      .text();
    expect(institutionName).to.include('National Certification Center');
  });

  it('should render the correct number of table rows for tests', () => {
    const examAccordion = wrapper.find('va-accordion-item').first();
    const tableRows = examAccordion.find('va-table-row');
    expect(tableRows.length).to.equal(4); // 3 test rows + 1 header row
  });

  it('should render the VA Form link correctly', () => {
    const formLink = wrapper.find('a').at(1);
    expect(formLink.props().href).to.equal(
      'https://www.va.gov/find-forms/about-form-22-0810/',
    );
    expect(formLink.text()).to.equal('Get link to VA Form 22-0810 to print');
  });

  it('should apply the inline style correctly to the reimbursement link', () => {
    const reimbursementLink = wrapper.find('a').at(0);
    expect(reimbursementLink.props().style).to.deep.equal({
      marginBottom: '16px',
      display: 'inline-block',
    });
  });
});
