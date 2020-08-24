import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import SearchControls from '../../components/SearchControls';

describe('SearchControls', () => {
  it('Should render search controls with VA benefits option selected', () => {
    const query = {
      facilityType: 'benefits',
    };
    const wrapper = shallow(<SearchControls currentQuery={query} />);
    expect(
      wrapper
        .render()
        .find('#facility-type-dropdown [selected]')
        .val(),
    ).to.equal(query.facilityType);
    wrapper.unmount();
  });
});
