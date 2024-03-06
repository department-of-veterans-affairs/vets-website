import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import asyncLoader from '../../ui/asyncLoader';

describe('asyncLoader', () => {
  it('should display loading indicator while waiting', () => {
    const Component = asyncLoader(() => new Promise(f => f), 'Test loading');

    const wrapper = shallow(<Component />);

    expect(wrapper.find('va-loading-indicator')).to.exist;
    expect(
      wrapper.find('va-loading-indicator').props('message').message,
    ).to.eql('Test loading');
    wrapper.unmount();
  });

  it('should display component returned from promise', () => {
    const promise = Promise.resolve(() => <div id="test">Test component</div>);
    const Component = asyncLoader(() => promise, 'Test loading');

    const wrapper = shallow(<Component />);

    expect(wrapper.find('#test')).to.exist;
    wrapper.unmount();
  });

  it('should unwrap default import if it exists', () => {
    const promise = Promise.resolve({
      default: () => <div id="test-default">Test component</div>,
    });
    const Component = asyncLoader(() => promise, 'Test loading');

    const wrapper = shallow(<Component />);

    expect(wrapper.find('#test-default')).to.exist;
    wrapper.unmount();
  });
});
