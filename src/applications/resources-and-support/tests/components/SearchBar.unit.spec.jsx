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

  it('should render the correct view', () => {
    render(<SearchBar {...searchBarProps} />);

    
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
