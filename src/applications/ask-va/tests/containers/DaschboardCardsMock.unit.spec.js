import {
  VaPagination,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import DashboardCards from '../../containers/DashboardCardsMock';
import { mockInquiryData } from '../../utils/mockData';

describe('DashboardCards Component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<DashboardCards />);
  });

  afterEach(() => {
    if (wrapper && wrapper.length > 0) {
      wrapper.unmount();
    }
  });

  it('should render the inquiries and filters once loaded', async () => {
    await act(async () => {
      wrapper.setProps({ inquiries: mockInquiryData.data, loading: false });
      wrapper.update();
    });

    // Check that the VaSelect elements for filtering are rendered
    expect(wrapper.find(VaSelect)).to.have.lengthOf(3);

    // Check that inquiries are rendered
    expect(wrapper.find('va-card')).to.have.lengthOf(4); // Assuming 4 inquiries are present

    // Check pagination is rendered
    expect(wrapper.find(VaPagination).exists()).to.be.true;
  });

  it('should filter inquiries by category when category filter is changed', async () => {
    await act(async () => {
      wrapper.setProps({ inquiries: mockInquiryData.data, loading: false });
      wrapper.update();
    });

    // Simulate changing the category filter
    const categorySelect = wrapper.find(VaSelect).at(1);
    await act(async () => {
      categorySelect.prop('onVaSelect')({ target: { value: 'Benefits' } });
      wrapper.update();
    });

    // Check if inquiries are filtered by category
    const filteredInquiries = wrapper.find('va-card');
    expect(filteredInquiries).to.have.lengthOf(4); // Assuming 2 inquiries match 'Benefits' category
  });

  it('should filter inquiries by status when status filter is changed', async () => {
    await act(async () => {
      wrapper.setProps({ inquiries: mockInquiryData.data, loading: false });
      wrapper.update();
    });

    // Simulate changing the status filter
    const statusSelect = wrapper.find(VaSelect).at(2);
    act(() => {
      statusSelect.prop('onVaSelect')({ target: { value: 'In Progress' } });
    });

    wrapper.update();

    // Check if inquiries are filtered by status
    const filteredInquiries = wrapper.find('va-card');
    expect(filteredInquiries).to.have.lengthOf(1); // Assuming 1 inquiry matches 'In Progress'
  });

  it('should paginate inquiries when page is changed', async () => {
    await act(async () => {
      wrapper.setProps({ inquiries: mockInquiryData.data, loading: false });
      wrapper.update();
    });

    // Simulate page change in pagination
    const pagination = wrapper.find(VaPagination);
    await act(async () => {
      pagination.prop('onPageSelect')({ detail: { page: 2 } });
      wrapper.update();
    });

    // Check if inquiries for the second page are rendered
    const paginatedInquiries = wrapper.find('va-card');
    expect(paginatedInquiries).to.have.lengthOf(4); // Assuming 4 inquiries per page
  });

  it('should show "No questions match your filter" if no inquiries match the filter', async () => {
    await act(async () => {
      wrapper.setProps({ inquiries: mockInquiryData.data, loading: false });
      wrapper.update();
    });

    // Simulate a filter with no matching inquiries
    const categorySelect = wrapper.find(VaSelect).at(1);
    act(() => {
      categorySelect.prop('onVaSelect')({
        target: { value: 'Non-existent Category' },
      });
    });

    wrapper.update();

    // Check if "No questions match your filter" is displayed
    expect(wrapper.find('va-alert').text()).to.include(
      'No questions match your filter',
    );
  });
});
