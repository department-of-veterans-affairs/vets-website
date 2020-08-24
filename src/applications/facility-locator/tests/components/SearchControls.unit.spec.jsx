import React from 'react';
// import { expect } from 'chai';
import { shallow } from 'enzyme';
import SearchControls from '../../components/SearchControls';

describe('SearchControls', () => {
  it('Should render search controls with VA benefits option selected', () => {
    const query = {
      facilityType: 'benefits',
    };
    const wrapper = shallow(<SearchControls currentQuery={query} />);
    // expect(wrapper.find('LocationDistance').length).to.equal(1);
    wrapper.unmount();
  });
});
