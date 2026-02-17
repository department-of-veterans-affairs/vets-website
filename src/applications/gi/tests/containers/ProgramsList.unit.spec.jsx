import React from 'react';
import { expect } from 'chai';
import { cleanup } from '@testing-library/react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import ProgramsList from '../../containers/ProgramsList';
import { generateMockPrograms } from '../../utils/helpers';

const mockStore = configureStore([thunk]);

describe('ProgramsList component', () => {
  let store;
  const numPrograms = 30;
  const initialState = {
    institutionPrograms: {
      institutionPrograms: generateMockPrograms(numPrograms),
      loading: false,
      error: null,
    },
  };
  beforeEach(() => {
    store = mockStore(initialState);
  });

  // Clean up after each test to unmount components
  afterEach(() => {
    cleanup();
  });

  // Helper function to mount the component with the provided loading state
  const mountComponent = () => {
    store = mockStore({
      institutionPrograms: {
        ...initialState.institutionPrograms,
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
    expect(wrapper.find('h1').exists()).to.be.true;
    expect(wrapper.find('h2').exists()).to.be.true;

    // Check that relevant components like search input, button, and pagination exist
    expect(wrapper.find('VaTextInput')).to.have.lengthOf(1);
    expect(wrapper.find('VaButton')).to.have.lengthOf(2);
    expect(wrapper.find('VaPagination')).to.have.lengthOf(1);

    wrapper.unmount();
  });

  it('should cause a re-render when the key state is changed', () => {
    const wrapper = mountComponent();
    const firstRender = wrapper.find('VaTextInput').exists();
    expect(firstRender).to.be.true;
    wrapper.find('VaButton.reset-search').getDOMNode().click();
    wrapper.update();
    const secondRender = wrapper.find('VaTextInput').exists();
    expect(secondRender).to.be.true;
    wrapper.unmount();
  });

  it('calculates the total number of pages correctly in VaPagination', () => {
    const wrapper = mountComponent();
    const itemsPerPage = 20;

    // Calculate the expected number of pages
    const totalItems =
      store.getState().institutionPrograms.institutionPrograms.length;
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
    const searchQuery = 'CISCO SYSTEMS - CCNA'; // Example search query that matches a program name

    // Dispatch native input event on web component
    const textInput = wrapper.find('VaTextInput').getDOMNode();
    textInput.value = searchQuery;
    textInput.dispatchEvent(new Event('input', { bubbles: true }));
    wrapper.update();

    // Simulate form submission with native click
    wrapper.find('VaButton').at(0).getDOMNode().click();
    wrapper.update();

    // Filter the mock programs to find the ones that match the search query
    const filteredPrograms = store
      .getState()
      .institutionPrograms.institutionPrograms.filter(program =>
        program.attributes.description.includes(searchQuery),
      );

    // Extract the program descriptions to compare with the displayed ones
    const displayedPrograms = wrapper.find('li').map(node => node.text());

    // Assert that the displayed programs match the filtered list
    const expectedPrograms = filteredPrograms.map(
      program => program.attributes.description,
    );
    expect(displayedPrograms).to.deep.equal(expectedPrograms);

    wrapper.unmount();
  });
  it('submits the search when Enter key is pressed in the search input', () => {
    const wrapper = mountComponent();
    const searchQuery = 'CISCO SYSTEMS - CCNA SECURITY';

    const textInput = wrapper.find('VaTextInput.search-input');
    expect(textInput.exists()).to.be.true;

    textInput.simulate('input', { target: { value: searchQuery } });
    wrapper.update();

    textInput.simulate('keydown', { key: 'Enter', preventDefault: () => {} });
    wrapper.update();

    const filteredPrograms = store
      .getState()
      .institutionPrograms.institutionPrograms.filter(program =>
        program.attributes.description.includes(searchQuery),
      );
    const displayedPrograms = wrapper.find('li').map(node => node.text());
    const expectedPrograms = filteredPrograms.map(
      program => program.attributes.description,
    );
    expect(displayedPrograms).to.deep.equal(expectedPrograms);
    wrapper.unmount();
  });
  it('applies the correct class when the number of programs is less than 21', () => {
    store = mockStore({
      institutionPrograms: {
        institutionPrograms: generateMockPrograms(10),
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
    const abbreviationsDiv = wrapper.find('h3.abbreviations').parent('div');
    expect(abbreviationsDiv.hasClass('vads-u-margin-bottom--4')).to.be.true;
    wrapper.unmount();
  });
  it('displays an error when the search input is empty and submitted', () => {
    const wrapper = mountComponent();
    wrapper.find('VaButton.search-btn').getDOMNode().click();
    wrapper.update();
    const errorMessage = wrapper.find('VaTextInput').prop('error');
    expect(errorMessage).to.equal(
      'Please fill in a program name and then select search.',
    );
    wrapper.unmount();
  });
  it('displays the loading indicator when loading is true', () => {
    store = mockStore({
      institutionPrograms: {
        institutionPrograms: [],
        loading: true,
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

    // Check if the loading indicator is rendered
    const loadingIndicator = wrapper.find('va-loading-indicator');
    expect(loadingIndicator.exists()).to.be.true;
    expect(loadingIndicator.prop('label')).to.equal('Loading');
    expect(loadingIndicator.prop('message')).to.equal(
      'Loading your programs...',
    );
    wrapper.unmount();
  });
  it('displays an error message when there is an error in the state', () => {
    store = mockStore({
      institutionPrograms: {
        institutionPrograms: [],
        loading: false,
        error: 'Server error occurred', // Simulate an error state
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <ProgramsList
          match={{ params: { programType: 'NCD', facilityCode: '1234' } }}
        />
      </Provider>,
    );

    // Check that the error alert is displayed
    const alert = wrapper.find('va-alert');
    expect(alert.exists()).to.be.true;
    expect(alert.prop('status')).to.equal('error');
    expect(alert.find('h2[slot="headline"]').text()).to.equal(
      'We can’t load the program list right now',
    );
    expect(alert.find('p').text()).to.include(
      'We’re sorry. There’s a problem with our system. Try again later.',
    );

    // Check  program type is displayed
    expect(wrapper.find('h1').exists()).to.be.true;
    expect(wrapper.find('h1').at(0).text().toUpperCase()).to.include('NCD');

    wrapper.unmount();
  });
  it('shows the "no-results-message" when no programs match the search query', () => {
    const wrapper = mountComponent();
    const impossibleQuery = 'ThisWillNotMatchAnyProgramName';
    const textInput = wrapper.find('VaTextInput.search-input');
    expect(textInput.exists()).to.be.true;

    const textInputNode = textInput.getDOMNode();
    textInputNode.value = impossibleQuery;
    textInputNode.dispatchEvent(new Event('input', { bubbles: true }));
    wrapper.update();

    const searchButton = wrapper.find('VaButton.search-btn');
    expect(searchButton.exists()).to.be.true;
    searchButton.getDOMNode().click();
    wrapper.update();

    const noResultsMessage = wrapper.find('#no-results-message');
    expect(noResultsMessage.exists()).to.be.true;
    expect(noResultsMessage.text()).to.include(
      `We didn’t find any results for`,
    );
    expect(noResultsMessage.text()).to.include(impossibleQuery);

    wrapper.unmount();
  });
  it('focuses on resultsSummaryRef after search results are displayed', done => {
    const wrapper = mountComponent();
    const resultsSummaryRef = wrapper.find('#results-summary');
    expect(resultsSummaryRef.exists()).to.be.true;
    const mockFocus = sinon.spy();
    resultsSummaryRef.getDOMNode().focus = mockFocus;

    const searchQuery = 'CISCO SYSTEMS - CCNA';
    const textInputNode = wrapper.find('VaTextInput.search-input').getDOMNode();
    textInputNode.value = searchQuery;
    textInputNode.dispatchEvent(new Event('input', { bubbles: true }));
    wrapper.update();

    wrapper.find('VaButton.search-btn').getDOMNode().click();
    wrapper.update();

    setTimeout(() => {
      expect(mockFocus.calledOnce).to.be.true;
      wrapper.unmount();
      done();
    }, 50);
  });

  it('renders "program" when there is one program and "programs" when multiple', () => {
    const oneProgramState = {
      institutionPrograms: {
        institutionPrograms: generateMockPrograms(1),
        loading: false,
        error: null,
      },
    };

    const multipleProgramsState = {
      institutionPrograms: {
        institutionPrograms: generateMockPrograms(5),
        loading: false,
        error: null,
      },
    };

    let testStore = mockStore(oneProgramState);
    let wrapper = mount(
      <Provider store={testStore}>
        <ProgramsList
          match={{ params: { programType: 'NCD', facilityCode: '1234' } }}
        />
      </Provider>,
    );

    const singularText = wrapper.find('#results-summary').text();
    expect(singularText).to.include('1 program');
    wrapper.unmount();

    testStore = mockStore(multipleProgramsState);
    wrapper = mount(
      <Provider store={testStore}>
        <ProgramsList
          match={{ params: { programType: 'NCD', facilityCode: '1234' } }}
        />
      </Provider>,
    );

    const pluralText = wrapper.find('#results-summary').text();
    expect(pluralText).to.include('5 programs');
    wrapper.unmount();
  });
  it('renders ojtAppType when programType is OJT and only description otherwise', () => {
    const ojtProgramsState = {
      institutionPrograms: {
        institutionPrograms: [
          {
            id: '1',
            attributes: {
              programType: 'OJT',
              ojtAppType: 'Apprentice',
              description: 'Electrician Training',
            },
          },
          {
            id: '2',
            attributes: {
              programType: 'NCD',
              description: 'Cybersecurity Certification',
            },
          },
        ],
        loading: false,
        error: null,
      },
    };

    const testStore2 = mockStore(ojtProgramsState);
    const wrapper = mount(
      <Provider store={testStore2}>
        <ProgramsList
          match={{ params: { programType: 'OJT', facilityCode: '1234' } }}
        />
      </Provider>,
    );
    const listItems = wrapper.find('li');
    expect(listItems.at(0).text()).to.equal('Apprentice Electrician Training');
    expect(listItems.at(1).text()).to.equal('Cybersecurity Certification');

    wrapper.unmount();
  });
});
