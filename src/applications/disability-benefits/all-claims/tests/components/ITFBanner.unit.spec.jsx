import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { ITFBanner } from '../../components/ITFBanner';

describe('ITFBanner', () => {
  const defaultProps = {
    messageDismissed: false,
    dismissITFMessage: sinon.spy(),
  };

  it('should render an error message', () => {
    const tree = mount(<ITFBanner {...defaultProps} status="error" />);
    expect(tree.text()).to.contain(
      'We can’t confirm if we have an intent to file on record for you right now',
    );
    tree.unmount();
  });

  it('should render an itf found message', () => {
    const tree = mount(
      <ITFBanner
        {...defaultProps}
        status="itf-found"
        title="Intent to File"
        currentExpDate="2025-12-31T00:00:00.000+0000"
      />,
    );
    expect(tree.text()).to.contain(
      'Our records show that you already have an Intent to File',
    );
    tree.unmount();
  });

  it('should render an itf created message', () => {
    const tree = mount(
      <ITFBanner
        {...defaultProps}
        status="itf-created"
        title="Intent to File"
        currentExpDate="2025-12-31T00:00:00.000+0000"
        previousExpDate="2024-12-31T00:00:00.000+0000"
        previousITF
      />,
    );
    expect(tree.text()).to.contain(
      'Thank you for submitting your Intent to File request',
    );
    tree.unmount();
  });

  it('should render children when messageDismissed is true', () => {
    const tree = mount(
      <ITFBanner {...defaultProps} messageDismissed status="error">
        <div className="child-content">Child Content</div>
      </ITFBanner>,
    );
    expect(tree.find('.child-content').text()).to.equal('Child Content');
    tree.unmount();
  });

  it('should call dismissITFMessage when Continue is clicked', () => {
    const dismissSpy = sinon.spy();
    const tree = mount(
      <ITFBanner
        {...defaultProps}
        dismissITFMessage={dismissSpy}
        status="error"
      />,
    );
    tree.find('button').simulate('click');
    expect(dismissSpy.calledOnce).to.be.true;
    tree.unmount();
  });

  it('should throw an error', () => {
    let tree;
    expect(() => {
      // component throws error in render; mount doesn't return reference until render is ran
      // mount component correctly and use setProps to trigger error state
      tree = mount(<ITFBanner {...defaultProps} status="error" />);
      tree.setProps({ status: 'nonsense' });
    }).to.throw();
    tree.unmount();
  });
});
