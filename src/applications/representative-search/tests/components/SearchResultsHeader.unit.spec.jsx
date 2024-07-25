import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import { SearchResultsHeader } from '../../components/results/SearchResultsHeader';
import testDataRepresentative from '../../constants/mock-representative-v0.json';
import testDataResponse from '../../constants/mock-representative-data.json';

describe('SearchResultsHeader', () => {
  it('should not render header if context is not provided', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[]}
        query={{ inProgress: false, searchArea: '50' }}
        pagination={{ totalEntries: 0 }}
      />,
    );

    expect(wrapper.find('#search-results-subheader').length).to.equal(0);
    wrapper.unmount();
  });

  it('should render header if results are empty and context exists', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[]}
        query={{
          representativeType: 'attorney',
          inProgress: false,
          context: { location: '11111' },
          searchArea: '50',
          sortType: 'distance_asc',
        }}
        pagination={{ totalEntries: 0 }}
      />,
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
    const wrapper = shallow(
      <SearchResultsHeader
        searchResults={[{}]}
        query={{ inProgress: true, searchArea: '50' }}
        pagination={{ totalEntries: 3, currentPage: 1, totalPages: 1 }}
      />,
    );

    expect(wrapper.find('#search-results-subheader').length).to.equal(0);
    wrapper.unmount();
  });

  it('should render header if results exist', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        query={{
          representativeType: 'attorney',
          inProgress: false,
          context: { location: 'new york' },
          searchArea: '50',
          sortType: 'distance_asc',
        }}
        pagination={{ totalEntries: 5 }}
      />,
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
    const wrapper = shallow(
      <SearchResultsHeader
        searchResults={[testDataRepresentative]}
        query={{
          representativeType: 'attorney',
          inProgress: false,
          context: { location: 'new york' },
          searchArea: '50',
          sortType: 'distance_asc',
        }}
        pagination={{ totalEntries: 1 }}
      />,
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
    const wrapper = shallow(
      <SearchResultsHeader
        searchResults={testDataResponse.data}
        query={{
          representativeType: 'attorney',
          inProgress: false,
          context: { location: 'new york' },
          searchArea: '50',
          sortType: 'distance_asc',
        }}
        pagination={{ totalEntries: 12, currentPage: 2, totalPages: 2 }}
      />,
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
    const wrapper = shallow(
      <SearchResultsHeader
        searchResults={testDataResponse.data}
        query={{
          representativeType: 'attorney',
          inProgress: false,
          context: { location: 'new york' },
          searchArea: '50',
          sortType: 'distance_asc',
        }}
        pagination={{ totalEntries: 5 }}
      />,
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
    const wrapper = shallow(
      <SearchResultsHeader
        searchResults={testDataResponse.data}
        query={{
          representativeType: 'attorney',
          inProgress: false,
          context: { location: 'new york' },
          searchArea: '50',
          sortType: 'distance_asc',
        }}
        pagination={{ totalEntries: 12, currentPage: 1, totalPages: 2 }}
      />,
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
    const wrapper = shallow(
      <SearchResultsHeader
        searchResults={testDataResponse.data}
        query={{
          representativeType: 'claim_agents',
          inProgress: false,
          context: { location: 'new york' },
          searchArea: '50',
          sortType: 'distance_asc',
        }}
        pagination={{ totalEntries: 25, currentPage: 2, totalPages: 3 }}
      />,
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
    const wrapper = shallow(
      <SearchResultsHeader
        searchResults={testDataResponse.data}
        query={{
          representativeType: 'claim_agents',
          sortType: 'last_name_asc',
          inProgress: false,
          context: { location: 'new york' },
          searchArea: '50',
        }}
        pagination={{ totalEntries: 25, currentPage: 2, totalPages: 3 }}
      />,
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
    let wrapper = shallow(
      <SearchResultsHeader
        results={[testDataRepresentative]}
        query={{
          representativeType: 'claim_agents',
          inProgress: false,
          context: { location: 'new york' },
          searchArea: '50',
          sortType: 'distance_asc',
        }}
        pagination={{ totalEntries: 5 }}
      />,
    );
    wrapper = shallow(
      <SearchResultsHeader
        results={[testDataRepresentative]}
        query={{
          representativeType: 'claim_agents',
          inProgress: false,
          context: { location: 'new york' },
          searchArea: '50',
          sortType: 'distance_asc',
        }}
        pagination={{ totalEntries: 5 }}
      />,
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

  it('calls updateSearchQuerySpy when sort is selected', () => {
    const updateSearchQuerySpy = sinon.spy();

    const wrapper = mount(
      <SearchResultsHeader
        updateSearchQuery={updateSearchQuerySpy}
        searchResults={[]}
        pagination={{ currentPage: 1, totalPages: 1, totalEntries: 0 }}
        query={{
          inProgress: false,
          context: {},
          representativeType: 'attorney',
          sortType: 'name',
          searchArea: '50',
        }}
        onClickApplyButtonTester
      />,
    );

    wrapper.find('#test-button').simulate('click');

    wrapper.update();

    sinon.assert.calledOnce(updateSearchQuerySpy);

    sinon.assert.calledWith(
      updateSearchQuerySpy,
      sinon.match({
        page: 1,
        sortType: 'name',
      }),
    );

    wrapper.unmount();
  });
});
