import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import {
  mockFetch,
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

  it('should hide the search bar', () => {
    const wrapper = shallow(<SearchMenu {...props} />);
    expect(wrapper.find('#search').prop('isOpen')).to.be.false;
    wrapper.unmount();
  });

  it('should show the search bar when opened', () => {
    const wrapper = mount(<SearchMenu {...props} />);
    wrapper.setProps({ isOpen: true });
    expect(wrapper.find('.va-dropdown-panel').prop('hidden')).to.be.false;
    wrapper.unmount();
  });
});
