import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import {
  mockFetch,
  resetFetch,
  setFetchJSONResponse as setFetchResponse,
} from 'platform/testing/unit/helpers';

import { SearchMenu } from '../../components/SearchMenu.jsx';

describe('<SearchMenu>', () => {
  const props = {
    isOpen: false,
    clickHandler: f => f,
  };

  beforeEach(() => {
    mockFetch();
    setFetchResponse(global.fetch.onFirstCall(), [
      'sample 1',
      'sample 2',
      'sample 3',
      'sample 4',
      'sample 5',
    ]);
  });

  afterEach(() => {
    resetFetch();
  });

  it('should hide the search bar', () => {
    const wrapper = shallow(<SearchMenu {...props} searchTypeaheadEnabled />);
    expect(wrapper.find('#search').prop('isOpen')).to.be.false;
    wrapper.unmount();
  });

  it('should show the search bar when opened', () => {
    const wrapper = mount(<SearchMenu {...props} searchTypeaheadEnabled />);
    wrapper.setProps({ isOpen: true });
    expect(wrapper.find('.va-dropdown-panel').prop('hidden')).to.be.false;
    wrapper.unmount();
  });

  it('should update the user input state', () => {
    const wrapper = mount(
      <SearchMenu {...props} isOpen searchTypeaheadEnabled />,
    );
    const changeEvent = { target: { value: 'testing' } };
    wrapper.find('#query').simulate('change', changeEvent);
    expect(wrapper.state('userInput')).to.equal('testing');
    wrapper.unmount();
  });

  it('does not show suggestions when user input is limited', () => {
    const wrapper = shallow(<SearchMenu searchTypeaheadEnabled />);
    wrapper.setState({ userInput: 'hm' });

    expect(global.fetch.called).to.be.false;
    wrapper.unmount();
  });

  it('shows suggestions', async () => {
    const wrapper = mount(
      <SearchMenu debounceRate={1} searchTypeaheadEnabled />,
    );

    wrapper.setState({
      userInput: 'sample',
    });

    await new Promise(resolve => setTimeout(resolve, 2));
    wrapper.update();

    expect(global.fetch.called).to.be.true;

    expect(wrapper.find('#suggestions-list').children()).to.have.lengthOf(5);

    expect(wrapper.html()).to.contain('sample<strong> 1</strong>');

    wrapper.unmount();
  });
});
