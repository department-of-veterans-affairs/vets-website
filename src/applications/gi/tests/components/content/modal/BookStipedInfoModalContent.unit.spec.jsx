import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import BookStipedInfoModalContent from '../../../../components/content/modals/BookStipendInfoModalContent';

describe('BookStipedInfoModalContent modal', () => {
  it('should render', () => {
    const wrapper = shallow(<BookStipedInfoModalContent />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
