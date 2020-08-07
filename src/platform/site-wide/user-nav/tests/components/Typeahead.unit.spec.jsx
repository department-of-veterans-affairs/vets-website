import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import {
  mockFetch,
  resetFetch,
  setFetchJSONResponse as setFetchResponse,
} from 'platform/testing/unit/helpers';

import Typeahead from '../../components/Typeahead';

describe('<Typeahead>', () => {
  beforeEach(() => {
    mockFetch();
    setFetchResponse(global.fetch.onFirstCall(), [
      'sample 1',
      'sample 2',
      'sample 3',
      'sample 4',
    ]);
  });

  afterEach(() => {
    resetFetch();
  });

  it('renders', () => {
    const wrapper = shallow(<Typeahead />);
    expect(wrapper.find('#onsite-search-typeahead')).to.exist;
    wrapper.unmount();
  });

  it('does not show suggestions when user input is limited', () => {
    const wrapper = shallow(<Typeahead />);
    wrapper.setProps({ userInput: 'hm' });

    expect(global.fetch.called).to.be.false;
    wrapper.unmount();
  });

  it('shows suggestions', async () => {
    const wrapper = shallow(<Typeahead debounceRate={1} />);
    wrapper.setProps({ userInput: 'test' });

    await new Promise(resolve => setTimeout(resolve, 2));

    expect(global.fetch.called).to.be.true;
    expect(wrapper.find('option')).to.have.lengthOf(4);
    expect(wrapper.html()).to.contain('value="sample 1"');

    wrapper.unmount();
  });
});
