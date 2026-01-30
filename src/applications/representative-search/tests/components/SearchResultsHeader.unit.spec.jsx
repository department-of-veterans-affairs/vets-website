import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import { SearchResultsHeader } from '../../components/results/SearchResultsHeader';
import testDataRepresentative from '../../constants/mock-representative-v0.json';
import testDataResponse from '../../constants/mock-representative-data.json';

describe('SearchResultsHeader', () => {
  const mockStore = {
    getState: () => ({
      featureToggles: {
        // eslint-disable-next-line camelcase
        find_a_representative_flagging_feature_enabled: true,
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };

  it('should not render header if context is not provided', () => {
    const query = {
      inProgress: false,
      searchArea: '50',
    };

    const wrapper = mount(
      <Provider store={mockStore}>
        <SearchResultsHeader
          results={[]}
          query={{
            ...query,
            committedSearchQuery: query,
          }}
          pagination={{ totalEntries: 0 }}
        />
      </Provider>,
    );

    expect(wrapper.find('#search-results-subheader').length).to.equal(0);
    wrapper.unmount();
  });

  it('should render header if results are empty and context exists', () => {
    const query = {
      representativeType: 'attorney',
      inProgress: false,
      context: { location: '11111' },
      searchArea: '50',
      sortType: 'distance_asc',
    };

    const wrapper = mount(
      <Provider store={mockStore}>
        <SearchResultsHeader
          results={[]}
          query={{
            ...query,
            committedSearchQuery: query,
          }}
          pagination={{ totalEntries: 0 }}
        />
      </Provider>,
    );

    const expectedString =
      'No results found for Accredited attorney within 50 miles of 11111 sorted by Distance (closest to farthest)';
    const actualString = wrapper.find('#search-results-subheader').text();

    // Remove whitespaces and special characters
    const cleanExpected = expectedString.replace(/\s+/g, '');
    const cleanActual = actualString.replace(/\s+/g, '');

    expect(cleanActual).to.equal(cleanExpected);

    wrapper.unmount();
  });

  it('should not render header if inProgress is true', () => {
    const query = {
      inProgress: true,
      searchArea: '50',
    };

    const wrapper = mount(
      <Provider store={mockStore}>
        <SearchResultsHeader
          searchResults={[{}]}
          query={{
            ...query,
            committedSearchQuery: query,
          }}
          pagination={{ totalEntries: 3, currentPage: 1, totalPages: 1 }}
        />
      </Provider>,
    );

    expect(wrapper.find('#search-results-subheader').length).to.equal(0);
    wrapper.unmount();
  });

  it('should render header if results exist', () => {
    const query = {
      representativeType: 'attorney',
      inProgress: false,
      context: { location: 'new york' },
      searchArea: '50',
      sortType: 'distance_asc',
    };

    const wrapper = mount(
      <Provider store={mockStore}>
        <SearchResultsHeader
          results={[{}]}
          query={{
            ...query,
            committedSearchQuery: query,
          }}
          pagination={{ totalEntries: 5 }}
        />
      </Provider>,
    );

    const expectedString =
      'No results found for Accredited attorney within 50 miles of new york sorted by Distance (closest to farthest)';
    const actualString = wrapper.find('#search-results-subheader').text();

    // Remove whitespaces and special characters
    const cleanExpected = expectedString.replace(/\s+/g, '');
    const cleanActual = actualString.replace(/\s+/g, '');

    expect(cleanActual).to.equal(cleanExpected);

    wrapper.unmount();
  });

  it('should render "Showing 1 result" if totalEntries === 1', () => {
    const query = {
      representativeType: 'attorney',
      inProgress: false,
      context: { location: 'new york' },
      searchArea: '50',
      sortType: 'distance_asc',
    };

    const wrapper = mount(
      <Provider store={mockStore}>
        <SearchResultsHeader
          searchResults={[testDataRepresentative]}
          query={{
            ...query,
            committedSearchQuery: query,
          }}
          pagination={{ totalEntries: 1 }}
        />
      </Provider>,
    );

    const expectedString =
      'Showing 1 result for Accredited attorney within 50 miles of new york sorted by Distance (closest to farthest)';
    const actualString = wrapper.find('#search-results-subheader').text();

    // Remove whitespaces and special characters
    const cleanExpected = expectedString.replace(/\s+/g, '');
    const cleanActual = actualString.replace(/\s+/g, '');

    expect(cleanActual).to.equal(cleanExpected);

    wrapper.unmount();
  });

  it('endResultNum should equal totalEntries when totalEntries > 10 and currentPage does equal totalPages', () => {
    const query = {
      representativeType: 'attorney',
      inProgress: false,
      context: { location: 'new york' },
      searchArea: '50',
      sortType: 'distance_asc',
    };

    const wrapper = mount(
      <Provider store={mockStore}>
        <SearchResultsHeader
          searchResults={testDataResponse.data}
          query={{
            ...query,
            committedSearchQuery: query,
          }}
          pagination={{ totalEntries: 12, currentPage: 2, totalPages: 2 }}
        />
      </Provider>,
    );

    const expectedString =
      'Showing 11 - 12 of 12 results for Accredited attorney within 50 miles of new york sorted by Distance (closest to farthest)';
    const actualString = wrapper.find('#search-results-subheader').text();

    // Remove whitespaces and special characters
    const cleanExpected = expectedString.replace(/\s+/g, '');
    const cleanActual = actualString.replace(/\s+/g, '');

    expect(cleanActual).to.equal(cleanExpected);

    wrapper.unmount();
  });

  it('should render "Showing _ results" if totalEntries is between 1 and 11', () => {
    const query = {
      representativeType: 'attorney',
      inProgress: false,
      context: { location: 'new york' },
      searchArea: '50',
      sortType: 'distance_asc',
    };

    const wrapper = mount(
      <Provider store={mockStore}>
        <SearchResultsHeader
          searchResults={testDataResponse.data}
          query={{
            ...query,
            committedSearchQuery: query,
          }}
          pagination={{ totalEntries: 5 }}
        />
      </Provider>,
    );
    const expectedString =
      'Showing 5 results for Accredited attorney within 50 miles of new york sorted by Distance (closest to farthest)';
    const actualString = wrapper.find('#search-results-subheader').text();

    // Remove whitespaces and special characters
    const cleanExpected = expectedString.replace(/\s+/g, '');
    const cleanActual = actualString.replace(/\s+/g, '');

    expect(cleanActual).to.equal(cleanExpected);

    wrapper.unmount();
  });

  it('should render "Showing {startResultNum} - {endResultNum} of {totalEntries} results" if totalEntries is 11 or higher', () => {
    const query = {
      representativeType: 'attorney',
      inProgress: false,
      context: { location: 'new york' },
      searchArea: '50',
      sortType: 'distance_asc',
    };
    
    const wrapper = mount(
      <Provider store={mockStore}>
        <SearchResultsHeader
          searchResults={testDataResponse.data}
          query={{
            ...query,
            committedSearchQuery: query,
          }}
          pagination={{ totalEntries: 12, currentPage: 1, totalPages: 2 }}
        />
      </Provider>,
    );

    const expectedString =
      'Showing 1-10 of 12 results for Accredited attorney within 50 miles of new york sorted by Distance (closest to farthest)';
    const actualString = wrapper.find('#search-results-subheader').text();

    // Remove whitespaces and special characters
    const cleanExpected = expectedString.replace(/\s+/g, '');
    const cleanActual = actualString.replace(/\s+/g, '');

    expect(cleanActual).to.equal(cleanExpected);

    wrapper.unmount();
  });

  it('should render endResultNum as 10 * currentPage if not on final page', () => {
    const query = {
      representativeType: 'claim_agents',
      inProgress: false,
      context: { location: 'new york' },
      searchArea: '50',
      sortType: 'distance_asc',
    };

    const wrapper = mount(
      <Provider store={mockStore}>
        <SearchResultsHeader
          searchResults={testDataResponse.data}
          query={{
            ...query,
            committedSearchQuery: query,
          }}
          pagination={{ totalEntries: 25, currentPage: 2, totalPages: 3 }}
        />
      </Provider>,
    );

    const expectedString =
      'Showing 11 - 20 of 25 results for Accredited claims agent within 50 miles of new york sorted by Distance (closest to farthest)';
    const actualString = wrapper.find('#search-results-subheader').text();

    // Remove whitespaces and special characters
    const cleanExpected = expectedString.replace(/\s+/g, '');
    const cleanActual = actualString.replace(/\s+/g, '');

    expect(cleanActual).to.equal(cleanExpected);

    wrapper.unmount();
  });

  it('should render results where sort option is last name (non-officer)', () => {
    const query = {
      representativeType: 'claim_agents',
      sortType: 'last_name_asc',
      inProgress: false,
      context: { location: 'new york' },
      searchArea: '50',
    };

    const wrapper = mount(
      <Provider store={mockStore}>
        <SearchResultsHeader
          searchResults={testDataResponse.data}
          query={{
            ...query,
            committedSearchQuery: query,
          }}
          pagination={{ totalEntries: 25, currentPage: 2, totalPages: 3 }}
        />
      </Provider>,
    );

    const expectedString =
      'Showing 11 - 20 of 25 results for Accredited claims agent within 50 miles of new york sorted by Last name (A-Z)';
    const actualString = wrapper.find('#search-results-subheader').text();

    // Remove whitespaces and special characters
    const cleanExpected = expectedString.replace(/\s+/g, '');
    const cleanActual = actualString.replace(/\s+/g, '');

    expect(cleanActual).to.equal(cleanExpected);

    wrapper.unmount();
  });

  it('should refresh header with new results', () => {
    const query = {
      representativeType: 'claim_agents',
      inProgress: false,
      context: { location: 'new york' },
      searchArea: '50',
      sortType: 'distance_asc',
    };

    const wrapper = mount(
      <Provider store={mockStore}>
        <SearchResultsHeader
          results={[testDataRepresentative]}
          query={{
            ...query,
            committedSearchQuery: query,
          }}
          pagination={{ totalEntries: 5 }}
        />
      </Provider>,
    );

    const expectedString =
      'No results found for Accredited claims agent within 50 miles of new york sorted by Distance (closest to farthest)';
    const actualString = wrapper.find('#search-results-subheader').text();

    // Remove whitespaces and special characters
    const cleanExpected = expectedString.replace(/\s+/g, '');
    const cleanActual = actualString.replace(/\s+/g, '');

    expect(cleanActual).to.equal(cleanExpected);

    wrapper.unmount();
  });

  it('calls updateSearchQuerySpy and commitSearchQuerySpy when sort is selected', () => {
    const updateSearchQuerySpy = sinon.spy();
    const commitSearchQuerySpy = sinon.spy();

    const query = {
      inProgress: false,
      context: {},
      representativeType: 'attorney',
      sortType: 'name',
      searchArea: '50',
    }

    const wrapper = mount(
      <Provider store={mockStore}>
        <SearchResultsHeader
          updateSearchQuery={updateSearchQuerySpy}
          commitSearchQuery={commitSearchQuerySpy}
          searchResults={[]}
          pagination={{ currentPage: 1, totalPages: 1, totalEntries: 0 }}
          query={{
            ...query,
            committedSearchQuery: query,
          }}
          onClickApplyButtonTester
        />
      </Provider>,
    );

    wrapper.find('#test-button').simulate('click');

    wrapper.update();

    sinon.assert.calledOnce(updateSearchQuerySpy);
    sinon.assert.calledOnce(commitSearchQuerySpy);

    sinon.assert.calledWith(
      updateSearchQuerySpy,
      sinon.match({
        page: 1,
        sortType: 'name',
      }),
    );

    sinon.assert.calledWith(
      commitSearchQuerySpy,
      sinon.match({
        page: 1,
        sortType: 'name',
      }),
    );

    wrapper.unmount();
  });
});
