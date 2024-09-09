import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import ITFBanner from '../../components/ITFBanner';

describe('ITFBanner', () => {
  it('should render an error message', () => {
    const tree = mount(<ITFBanner status="error" />);
    expect(tree.text()).to.contain(
      'We can’t confirm if we have an intent to file on record for you right now',
    );
    tree.unmount();
  });

  it('should render an itf found message', () => {
    const tree = mount(<ITFBanner status="itf-found" />);
    expect(tree.text()).to.contain(
      'Our records show that you already have an Intent to File',
    );
    tree.unmount();
  });

  it('should render an itf created message', () => {
    const tree = mount(<ITFBanner status="itf-created" />);
    expect(tree.text()).to.contain(
      'Thank you for submitting your Intent to File request',
    );
    tree.unmount();
  });

  it('should throw an error', () => {
    let tree;
    expect(() => {
      // component throws error in render; mount doesn't return reference until render is ran
      // mount component correctly and use setProps to trigger error state
      tree = mount(<ITFBanner status="error" />);
      tree.setProps({ status: 'nonsense' });
    }).to.throw();
    tree.unmount();
  });
});
