import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import ITFBanner from '../../components/ITFBanner';

describe('ITFBanner', () => {
  it('should render an error message', () => {
    const tree = mount(<ITFBanner status="error" />);
    expect(tree.text()).to.contain(
      'Your Intent to File request didn’t go through',
    );
  });

  it('should render an itf found message', () => {
    const tree = mount(<ITFBanner status="itf-found" />);
    expect(tree.text()).to.contain(
      'Our records show that you already have an Intent to File',
    );
  });

  it('should render an itf created message', () => {
    const tree = mount(<ITFBanner status="itf-created" />);
    expect(tree.text()).to.contain(
      'Thank you for submitting your Intent to File request',
    );
  });

  it('should throw an error', () => {
    expect(() => mount(<ITFBanner status="nonsense" />)).to.throw();
  });
});
