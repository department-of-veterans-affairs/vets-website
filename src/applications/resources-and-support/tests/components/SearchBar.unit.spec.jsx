import React from 'react';
import { render } from '@testing-library/react';

import { shallow } from 'enzyme';
import { expect } from 'chai';

import SearchBar from '../../components/SearchBar';

describe('SearchBar', () => {
  const searchBarProps = {
    onInputChange: () => {},
    previousValue: 'test',
    setSearchData: () => {},
    userInput: 'new test',
  };

  it('should render the correct view for mobile', () => {
    window.innerWidth = 400;
    render(<SearchBar {...searchBarProps} />);

    expect(document.querySelector('[data-testid="rs-mobile-expand-collapse"]')).to.exist;
    expect(document.querySelector('va-icon[icon="add"]')).to.exist;
    expect(document.querySelector('va-icon[icon="remove"]')).to.exist;
    expect(document.querySelector('[label="Search resources and support articles or all of VA.gov"]')).to.exist;
    expect(document.querySelector('[label="Resources and Support"]')).to.exist;
    expect(document.querySelector('[label="All VA.gov"]')).to.exist;
    expect(document.querySelector('va-search-input')).to.exist;
  });

  it('should render the correct view for desktop', () => {
    window.innerWidth = 1200;
    render(<SearchBar {...searchBarProps} />);

    expect(document.querySelector('[label="Search resources and support articles or all of VA.gov"]')).to.exist;
    expect(document.querySelector('[label="Resources and Support"]')).to.exist;
    expect(document.querySelector('[label="All VA.gov"]')).to.exist;
    expect(document.querySelector('va-search-input')).to.exist;
  });
  // it('renders without crashing', () => {
  //   let testInput = '';
  //   const setTestInput = str => {
  //     testInput = str;
  //   };

  //   const wrapper = shallow(
  //     <SearchBar
  //       userInput={testInput}
  //       onInputChange={setTestInput}
  //       useDefaultFormSearch
  //     />,
  //   );

  //   expect(wrapper).to.exist;
  //   wrapper.unmount();
  // });

  // it('renders without crashing with a search term', () => {
  //   let testInput = 'health';
  //   const setTestInput = str => {
  //     testInput = str;
  //   };

  //   const wrapper = shallow(
  //     <SearchBar
  //       userInput={testInput}
  //       onInputChange={setTestInput}
  //       useDefaultFormSearch
  //     />,
  //   );

  //   expect(wrapper).to.exist;
  //   wrapper.unmount();
  // });
});
