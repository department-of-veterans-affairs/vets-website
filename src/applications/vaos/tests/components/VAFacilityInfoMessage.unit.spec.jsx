import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import VAFacilityInfoMessage from '../../components/VAFacilityInfoMessage';

describe('VAOS <VAFacilityInfoMessage>', () => {
  it('should render alert message', () => {
    const facility = {
      institution: {},
    };
    const tree = mount(<VAFacilityInfoMessage facility={facility} />);

    expect(tree.text()).to.contain(
      'Not all VA locations offer all types of care',
    );
    expect(tree.find('[aria-atomic="true"]').exists()).to.be.true;
    tree.unmount();
  });
});
