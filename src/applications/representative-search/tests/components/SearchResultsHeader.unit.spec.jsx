import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { SearchResultsHeader } from '../../components/search/SearchResultsHeader';
import { RepresentativeType } from '../../constants';

describe('SearchResultsHeader', () => {
  it('should not render header if context is not provided', () => {
    const wrapper = shallow(<SearchResultsHeader results={[]} />);

    expect(wrapper.find('h2').length).to.equal(0);
    wrapper.unmount();
  });

  it('should render header if results are empty and context exists', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[]}
        context="11111"
        pagination={{ totalEntries: 0 }}
      />,
    );

    expect(
      wrapper
        .find('h2')
        .text()
        .replace(/[^A-Za-z0-9" ]/g, ' '),
    ).to.equal('No results found for "" within 50 miles of "11111"');
    wrapper.unmount();
  });

  it('should not render header if inProgress is true', () => {
    const wrapper = shallow(<SearchResultsHeader results={[{}]} inProgress />);

    expect(wrapper.find('h2').length).to.equal(0);
    wrapper.unmount();
  });

  it('should render header if results exist', () => {
    const wrapper = shallow(
      <SearchResultsHeader
        results={[{}]}
        representativeType={RepresentativeType.VETERAN_SERVICE_ORGANIZATION}
        context="new york"
        pagination={{ totalEntries: 5 }}
      />,
    );

    expect(
      wrapper
        .find('h2')
        .text()
        .replace(/[^A-Za-z0-9" ]/g, ' '),
    ).to.equal('No results found for "vso" within 50 miles of "new york"');

    wrapper.unmount();
  });

  it('should refresh header with new results', () => {
    let wrapper = shallow(
      <SearchResultsHeader
        results={[{ guy: 1 }]}
        representativeType={RepresentativeType.VETERAN_SERVICE_ORGANIZATION}
        context="new jersey"
        pagination={{ totalEntries: 5 }}
      />,
    );
    wrapper = shallow(
      <SearchResultsHeader
        results={[{ guy: 1 }]}
        representativeType={RepresentativeType.VETERAN_SERVICE_ORGANIZATION}
        context="new york"
        pagination={{ totalEntries: 5 }}
      />,
    );

    expect(
      wrapper
        .find('h2')
        .text()
        .replace(/[^A-Za-z0-9" ]/g, ' '),
    ).to.equal('No results found for "vso" within 50 miles of "new york"');
    wrapper.unmount();
  });

  // it('should render header with RepresentativeType.VETERAN_SERVICE_ORGANIZATION, totalEntries = 15, currentPage = 2, totalPages = 2', () => {
  //   const wrapper = shallow(
  //     <SearchResultsHeader
  //       results={[{}]}
  //       representativeType={RepresentativeType.VETERAN_SERVICE_ORGANIZATION}
  //       serviceType="PrimaryCare"
  //       context="new york"
  //       pagination={{ totalEntries: 15, currentPage: 2, totalPages: 2 }}
  //     />,
  //   );

  //   expect(wrapper.find('h2').text()).to.match(
  //     /Showing 11 - 15 of 15 results for "VA health",\s+"Primary care"\s+near\s+"new york"/,
  //   );
  //   wrapper.unmount();
  // });

  // it('should render header with RepresentativeType.VETERAN_SERVICE_ORGANIZATION, totalEntries = 5', () => {
  //   const wrapper = shallow(
  //     <SearchResultsHeader
  //       results={[{}]}
  //       representativeType={RepresentativeType.VETERAN_SERVICE_ORGANIZATION}
  //       context="new york"
  //       pagination={{ totalEntries: 5 }}
  //     />,
  //   );

  //   expect(wrapper.find('h2').text()).to.match(
  //     /Showing 1 - 5 results for "Community pharmacies \(in VA’s network\)"\s+near\s+"new york"/,
  //   );
  //   wrapper.unmount();
  // });

  // it('should render header with RepresentativeType.VETERAN_SERVICE_ORGANIZATION, totalEntries = 15, currentPage = 2, totalPages = 2', () => {
  //   const wrapper = shallow(
  //     <SearchResultsHeader
  //       results={[{}]}
  //       representativeType={RepresentativeType.VETERAN_SERVICE_ORGANIZATION}
  //       serviceType="foo"
  //       context="new york"
  //       specialtyMap={{ foo: 'test' }}
  //       pagination={{ totalEntries: 15, currentPage: 2, totalPages: 2 }}
  //     />,
  //   );

  //   expect(wrapper.find('h2').text()).to.match(
  //     /Showing 11 - 15 of 15 results for "Community providers \(in VA’s network\)",\s+"test"\s+near\s+"new york"/,
  //   );
  //   wrapper.unmount();
  // });
});
