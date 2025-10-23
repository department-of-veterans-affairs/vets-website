import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import DownloadLink from '../../components/DownloadLink';

describe('DownloadLink in Pre-need components', () => {
  const testContent = 'test';
  const props = {
    content: testContent,
    subTaskEvent: true,
  };
  const staticText = ' (PDF, 3 pages)';
  const expectedTestContent = 'Download VA Form 40-10007 (PDF, 3 pages)';

  it('should render', () => {
    const wrapper = mount(<DownloadLink {...props} />);
    expect(wrapper.find('a').length).to.equal(1);
    wrapper.unmount();
  });

  it('should have default text content', () => {
    const wrapper = mount(<DownloadLink />);
    expect(
      wrapper
        .find('a')
        .at(0)
        .text(),
    ).to.equal(expectedTestContent);
    wrapper.unmount();
  });

  it('should have input text content', () => {
    const wrapper = mount(<DownloadLink {...props} />);
    expect(
      wrapper
        .find('a')
        .at(0)
        .text(),
    ).to.equal(testContent + staticText);
    wrapper.unmount();
  });

  it('should have data layer events', () => {
    props.subTaskEvent = true;
    const wrapper = mount(<DownloadLink {...props} />);
    const expandedContent = wrapper.find('a');
    expandedContent.simulate('click');
    const priorEvent = window.dataLayer;
    expect(priorEvent.length).to.equal(1);
    expandedContent.simulate('click');
    expect(priorEvent.length).to.equal(2);
    wrapper.unmount();
  });

  it('should not have data layer events', () => {
    props.subTaskEvent = false;
    const wrapper = mount(<DownloadLink {...props} />);
    const expandedContent = wrapper.find('a');
    expandedContent.simulate('click');
    const priorEvent = window.dataLayer;
    expect(priorEvent.length).to.equal(0);
    wrapper.unmount();
  });
});
