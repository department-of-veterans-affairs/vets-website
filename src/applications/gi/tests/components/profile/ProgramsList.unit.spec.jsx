import React from 'react';
import { expect } from 'chai';
import { cleanup } from '@testing-library/react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import ProgramsList from '../../../components/profile/ProgramsList';

const mockStore = configureStore([thunk]);

describe('ProgramsList component', () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      institutionPrograms: {
        institutionPrograms: Array.from({ length: 30 }, (_, index) => ({
          id: index + 1,
          attributes: {
            description: `Program ${index + 1}`,
            institutionName: `Institution ${index + 1}`,
          },
        })),
        loading: false,
        error: null,
      },
    });
  });

  // Clean up after each test to unmount components
  afterEach(() => {
    cleanup();
  });

  // Helper function to mount the component with the provided loading state
  const mountComponent = (loading = false) => {
    store = mockStore({
      institutionPrograms: {
        institutionPrograms: Array.from({ length: 30 }, (_, index) => ({
          id: index + 1,
          attributes: {
            description: `Program ${index + 1}`,
            institutionName: `Institution ${index + 1}`,
          },
        })),
        loading,
        error: null,
      },
    });

    return mount(
      <Provider store={store}>
        <ProgramsList
          match={{ params: { programType: 'NCD', facilityCode: '1234' } }}
        />
      </Provider>,
    );
  };

  it('should render institution name and program type when not loading', () => {
    const wrapper = mountComponent();

    // Check that the institution name and program type are rendered
    expect(wrapper.find('h1').text()).to.equal('Institution 1');
    expect(wrapper.find('h2').exists()).to.be.true;

    // Check that relevant components like search input, button, and pagination exist
    expect(wrapper.find('VaTextInput')).to.have.lengthOf(1);
    expect(wrapper.find('VaButton')).to.have.lengthOf(1);
    expect(wrapper.find('VaPagination')).to.have.lengthOf(1);

    wrapper.unmount();
  });

  it('calculates the total number of pages correctly in VaPagination', () => {
    const wrapper = mountComponent();
    const itemsPerPage = 20;

    // Calculate the expected number of pages
    const totalItems = store.getState().institutionPrograms.institutionPrograms
      .length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Check if VaPagination is receiving the correct number of pages as a prop
    const paginationComponent = wrapper.find('VaPagination');
    expect(paginationComponent.prop('pages')).to.equal(totalPages);

    wrapper.unmount();
  });

  it('slices programs correctly for the current page', () => {
    const wrapper = mountComponent();
    const itemsPerPage = 20;
    const currentPage = 2;

    // Simulate a page change to the second page
    wrapper.find('VaPagination').prop('onPageSelect')({
      detail: { page: currentPage },
    });
    wrapper.update();

    // Calculate the expected programs to be displayed
    const expectedPrograms = store
      .getState()
      .institutionPrograms.institutionPrograms.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      )
      .map(program => program.attributes.description);

    // Check that the displayed programs match the expected ones
    const displayedPrograms = wrapper.find('li').map(node => node.text());
    expect(displayedPrograms).to.deep.equal(expectedPrograms);

    wrapper.unmount();
  });

  it('simulates page change in VaPagination to page 2 and verifies displayed items', async () => {
    const wrapper = mountComponent();
    const newPage = 2;

    // Simulate a page change to the second page
    wrapper.find('VaPagination').prop('onPageSelect')({
      detail: { page: newPage },
    });
    wrapper.update();

    // Wait for async updates to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    const itemsPerPage = 20;

    // Calculate the expected items to be displayed on the second page
    const expectedItems = store
      .getState()
      .institutionPrograms.institutionPrograms.slice(
        (newPage - 1) * itemsPerPage,
        newPage * itemsPerPage,
      )
      .map(program => program.attributes.description);

    // Check that the displayed items match the expected ones
    const displayedItems = wrapper.find('li').map(node => node.text());
    expect(displayedItems).to.deep.equal(expectedItems);

    wrapper.unmount();
  });

  it('handles search input correctly', () => {
    const wrapper = mountComponent();
    const searchQuery = 'Program 21';

    // Simulate user input in the search field
    wrapper
      .find('VaTextInput')
      .simulate('input', { target: { value: searchQuery } });
    wrapper.update();

    // Simulate form submission
    wrapper
      .find('VaButton')
      .at(0)
      .simulate('click');
    wrapper.update();

    // Check if the correct programs are displayed after search
    const displayedPrograms = wrapper.find('li').map(node => node.text());
    const expectedPrograms = ['Program 21'];

    // Assert that the displayed programs match the expected filtered list
    expect(displayedPrograms).to.deep.equal(expectedPrograms);
    wrapper.unmount();
  });

  it('displays an error when the search input is empty and submitted', () => {
    const wrapper = mountComponent();
    wrapper.find('VaButton').simulate('click');
    wrapper.update();
    const errorMessage = wrapper.find('VaTextInput').prop('error');
    expect(errorMessage).to.equal(
      'Please fill in a program name and then select search.',
    );
    wrapper.unmount();
  });
  it('displays the loading indicator when loading is true', () => {
    // Mount the component with loading state set to true
    const wrapper = mountComponent(true);

    // Check if the loading indicator is rendered
    const loadingIndicator = wrapper.find('va-loading-indicator');
    expect(loadingIndicator.exists()).to.be.true;
    expect(loadingIndicator.prop('label')).to.equal('Loading');
    expect(loadingIndicator.prop('message')).to.equal(
      'Loading your programs...',
    );
    wrapper.unmount();
  });
  it('displays a message when no programs are found', () => {
    store = mockStore({
      institutionPrograms: {
        institutionPrograms: [],
        loading: false,
        error: null,
      },
    });
    const wrapper = mount(
      <Provider store={store}>
        <ProgramsList
          match={{ params: { programType: 'NCD', facilityCode: '1234' } }}
        />
      </Provider>,
    );
    expect(wrapper.text()).to.include('We didn’t find any results for');
    wrapper.unmount();
  });
});
