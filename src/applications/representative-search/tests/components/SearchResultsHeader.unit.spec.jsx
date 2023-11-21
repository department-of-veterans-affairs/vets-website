import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { SearchResultsHeader } from '../../components/search/SearchResultsHeader';
// import { RepresentativeType } from '../../constants';
// import testDataRepresentative from '../../constants/mock-representative-v0.json';
// import testDataResponse from '../../constants/mock-representative-data.json';

describe('SearchResultsHeader', () => {
  // it('should not render header if context is not provided', () => {
  //   const wrapper = shallow(
  //     <SearchResultsHeader results={[]} pagination={{ totalEntries: 0 }} />,
  //   );

  //   expect(wrapper.find('h2').length).to.equal(0);
  //   wrapper.unmount();
  // });

  // it('should render header if results are empty and context exists', () => {
  //   const wrapper = shallow(
  //     <SearchResultsHeader
  //       results={[]}
  //       context="11111"
  //       pagination={{ totalEntries: 0 }}
  //     />,
  //   );

  //   expect(
  //     wrapper
  //       .find('h2')
  //       .text()
  //       .replace(/[^A-Za-z0-9" ]/g, ' '),
  //   ).to.equal('No results found for "" within 50 miles of "11111"');
  //   wrapper.unmount();
  // });

  it('should not render header if inProgress is true', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        searchResults={[{}]}
        inProgress
        pagination={{ totalEntries: 3, currentPage: 1, totalPages: 1 }}
      />,
    );

    expect(wrapper.find('h2').length).to.equal(0);
    wrapper.unmount();
  });

  // it('should render header if results exist', () => {
  //   const wrapper = shallow(
  //     <SearchResultsHeader
  //       results={[{}]}
  //       representativeType={RepresentativeType.ATTORNEY}
  //       context="new york"
  //       pagination={{ totalEntries: 5 }}
  //     />,
  //   );

  //   expect(
  //     wrapper
  //       .find('h2')
  //       .text()
  //       .replace(/[^A-Za-z0-9" ]/g, ' '),
  //   ).to.equal('No results found for "attorney" within 50 miles of "new york"');

  //   wrapper.unmount();
  // });

  // it('should render "Showing 1 result" if totalEntries === 1', () => {
  //   const wrapper = shallow(
  //     <SearchResultsHeader
  //       searchResults={[testDataRepresentative]}
  //       representativeType={RepresentativeType.ATTORNEY}
  //       context="new york"
  //       pagination={{ totalEntries: 1 }}
  //     />,
  //   );

  //   expect(
  //     wrapper
  //       .find('h2')
  //       .text()
  //       .replace(/[^A-Za-z0-9" ]/g, ' '),
  //   ).to.equal('Showing 1 result for "attorney" within 50 miles of "new york"');

  //   wrapper.unmount();
  // });

  // it('should render "Showing 1 - _ results" if totalEntries is between 1 and 11', () => {
  //   const wrapper = shallow(
  //     <SearchResultsHeader
  //       searchResults={testDataResponse.data}
  //       representativeType={RepresentativeType.ATTORNEY}
  //       context="new york"
  //       pagination={{ totalEntries: 5 }}
  //     />,
  //   );

  //   const expectedString =
  //     'Showing 1 - 5 results for "attorney" within 50 miles of "new york"';
  //   const actualString = wrapper.find('h2').text();

  //   // Remove whitespaces and special characters
  //   const cleanExpected = expectedString.replace(/\s+/g, '');
  //   const cleanActual = actualString.replace(/\s+/g, '');

  //   expect(cleanActual).to.equal(cleanExpected);

  //   wrapper.unmount();
  // });

  // it('should render "Showing {startResultNum} - {endResultNum} of {totalEntries} results" if totalEntries is 11 or higher', () => {
  //   const wrapper = shallow(
  //     <SearchResultsHeader
  //       searchResults={testDataResponse.data}
  //       representativeType={RepresentativeType.ATTORNEY}
  //       context="new york"
  //       pagination={{ totalEntries: 12, currentPage: 1, totalPages: 2 }}
  //     />,
  //   );

  //   const expectedString =
  //     'Showing 1 - 10 of 12 results for "attorney" within 50 miles of "new york"';
  //   const actualString = wrapper.find('h2').text();

  //   // Remove whitespaces and special characters
  //   const cleanExpected = expectedString.replace(/\s+/g, '');
  //   const cleanActual = actualString.replace(/\s+/g, '');

  //   expect(cleanActual).to.equal(cleanExpected);

  //   wrapper.unmount();
  // });

  // it('should render endResultNum as 10 * currentPage if not on final page', () => {
  //   const wrapper = shallow(
  //     <SearchResultsHeader
  //       searchResults={testDataResponse.data}
  //       representativeType={RepresentativeType.ATTORNEY}
  //       context="new york"
  //       pagination={{ totalEntries: 25, currentPage: 2, totalPages: 3 }}
  //     />,
  //   );

  //   const expectedString =
  //     'Showing 11 - 20 of 25 results for "attorney" within 50 miles of "new york"';
  //   const actualString = wrapper.find('h2').text();

  //   // Remove whitespaces and special characters
  //   const cleanExpected = expectedString.replace(/\s+/g, '');
  //   const cleanActual = actualString.replace(/\s+/g, '');

  //   expect(cleanActual).to.equal(cleanExpected);

  //   wrapper.unmount();
  // });

  // it('should refresh header with new results', () => {
  //   let wrapper = shallow(
  //     <SearchResultsHeader
  //       results={[testDataRepresentative]}
  //       representativeType={RepresentativeType.CLAIM_AGENTS}
  //       context="new jersey"
  //       pagination={{ totalEntries: 5 }}
  //     />,
  //   );
  //   wrapper = shallow(
  //     <SearchResultsHeader
  //       results={[testDataRepresentative]}
  //       representativeType={RepresentativeType.CLAIM_AGENTS}
  //       context="new york"
  //       pagination={{ totalEntries: 5 }}
  //     />,
  //   );

  //   expect(
  //     wrapper
  //       .find('h2')
  //       .text()
  //       .replace(/[^A-Za-z0-9" ]/g, ' '),
  //   ).to.equal(
  //     'No results found for "claims agent" within 50 miles of "new york"',
  //   );
  //   wrapper.unmount();
  // });
});
