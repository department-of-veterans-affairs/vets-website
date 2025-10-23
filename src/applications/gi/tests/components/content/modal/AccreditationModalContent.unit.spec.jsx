import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import AccreditationModalContent from '../../../../components/content/modals/AccreditationModalContent';

describe('AccreditationModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<AccreditationModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
