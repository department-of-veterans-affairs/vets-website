import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Verified from '../../components/Verified';

describe('Verified component', () => {
  let wrapper;
  const text = 'This is verified';
  beforeEach(() => {
    wrapper = shallow(<Verified>{text}</Verified>);
  });
  afterEach(() => {
    wrapper.unmount();
  });
  it('should render a `span`', () => {
    expect(wrapper.type()).to.equal('span');
  });

  it('should render a Font Awesome check mark as its first child', () => {
    const firstChild = wrapper.childAt(0);
    expect(firstChild.type()).to.equal('i');
    expect(firstChild.hasClass('fa-check')).to.be.true;
  });

  it('should render its `children` after the check mark', () => {
    expect(wrapper.text().includes(text)).to.be.true;
  });
});
