import React from 'react';
import { expect } from 'chai';
import { shallow, render } from 'enzyme';
import AppealInfo from '../../../../src/js/claims-status/components/appeals-v2/AppealInfo';

describe.only('<AppealInfo/>', () => {
  it('should render', () => {
    const wrapper = shallow(<AppealInfo/>);
    expect(wrapper.type()).to.equal('div');
  });

  it('should render one tablist', () => {
    const wrapper = shallow(<AppealInfo/>);
    const countTabLists = wrapper.find('ul.claim-appeal-tabs').length;
    expect(countTabLists).to.equal(1);
  });

  it('should render status and detail tabs in the tab list', () => {
    const staticWrapper = render(<AppealInfo/>);
    const statusTabText = staticWrapper.find('.status-tab-button').text();
    const detailTabText = staticWrapper.find('.detail-tab-button').text();
    expect(statusTabText).to.equal('Status');
    expect(detailTabText).to.equal('Detail');
  });

  it('should default to showing the status tab', () => {
    const wrapper = shallow(<AppealInfo/>);
    const defaultTab = wrapper.state().activeTab;
    expect(defaultTab).to.equal('Status');
  });
});
