import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { SearchResultsHeader } from '../../components/results/SearchResultsHeader';
// import { RepresentativeType } from '../../constants';
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

    expect(wrapper.find('h3').length).to.equal(0);
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
        }}
        pagination={{ totalEntries: 0 }}
      />,
    );

    expect(
      wrapper
        .find('h3')
        .text()
        .replace(/[^A-Za-z0-9" ]/g, ' '),
    ).to.equal('No results found for "Attorneys" within "50 miles" of "11111"');
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

    expect(wrapper.find('h3').length).to.equal(0);
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
        }}
        pagination={{ totalEntries: 5 }}
      />,
    );

    expect(
      wrapper
        .find('h3')
        .text()
        .replace(/[^A-Za-z0-9" ]/g, ' '),
    ).to.equal(
      'No results found for "Attorneys" within "50 miles" of "new york"',
    );

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
        }}
        pagination={{ totalEntries: 1 }}
      />,
    );

    expect(
      wrapper
        .find('h3')
        .text()
        .replace(/[^A-Za-z0-9" ]/g, ' '),
    ).to.equal(
      'Showing 1 result for "Attorneys" within "50 miles" of "new york"',
    );

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
        }}
        pagination={{ totalEntries: 12, currentPage: 2, totalPages: 2 }}
      />,
    );

    const expectedString =
      'Showing 11 - 12 of 12 results for "Attorneys" within "50 miles" of "new york"';
    const actualString = wrapper.find('h3').text();

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
        }}
        pagination={{ totalEntries: 5 }}
      />,
    );

    const expectedString =
      'Showing 5 results for "Attorneys" within "50 miles" of "new york"';
    const actualString = wrapper.find('h3').text();

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
        }}
        pagination={{ totalEntries: 12, currentPage: 1, totalPages: 2 }}
      />,
    );

    const expectedString =
      'Showing1-10of12resultsfor"Attorneys"within"50miles"of"newyork"';
    const actualString = wrapper.find('h3').text();

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
        }}
        pagination={{ totalEntries: 25, currentPage: 2, totalPages: 3 }}
      />,
    );

    const expectedString =
      'Showing 11 - 20 of 25 results for "Claims agents" within "50 miles" of "new york"';
    const actualString = wrapper.find('h3').text();

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
      'Showing 11 - 20 of 25 results for "Claims agents" within "50 miles" of "new york"';
    const actualString = wrapper.find('h3').text();

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
        }}
        pagination={{ totalEntries: 5 }}
      />,
    );

    expect(
      wrapper
        .find('h3')
        .text()
        .replace(/[^A-Za-z0-9" ]/g, ' '),
    ).to.equal(
      'No results found for "Claims agents" within "50 miles" of "new york"',
    );
    wrapper.unmount();
  });
});
