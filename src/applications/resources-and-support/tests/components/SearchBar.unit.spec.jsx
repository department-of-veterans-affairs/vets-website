// Node modules
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

// Relative imports
import SearchBar from '../../components/SearchBar';

describe('SearchBar', () => {
  it('renders without crashing', () => {
    let testInput = '';
    const setTestInput = str => {
      testInput = str;
    };

    const wrapper = shallow(
      <SearchBar
        userInput={testInput}
        onInputChange={setTestInput}
        useDefaultFormSearch
      />,
    );

    expect(wrapper).to.exist;
    wrapper.unmount();
  });

  it('renders without crashing with a search term', () => {
    let testInput = 'health';
    const setTestInput = str => {
      testInput = str;
    };

    const wrapper = shallow(
      <SearchBar
        userInput={testInput}
        onInputChange={setTestInput}
        useDefaultFormSearch
      />,
    );

    expect(wrapper).to.exist;
    wrapper.unmount();
  });
});
