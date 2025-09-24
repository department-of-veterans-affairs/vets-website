import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ViewDependentsApp } from '../../containers/ViewDependentsApp';

describe('<ViewDependentsApp />', () => {
  it('should render a ViewDependentsLayout', () => {
    const fetchAllDependentsMock = sinon.spy();
    const wrapper = shallow(
      <ViewDependentsApp fetchAllDependents={fetchAllDependentsMock}>
        <div>App Children</div>
      </ViewDependentsApp>,
    );
    expect(wrapper.find('ViewDependentsLayout').length).to.equal(1);
    wrapper.unmount();
  });

  it('should render a RequiredLoginView', () => {
    const fetchAllDependentsMock = sinon.spy();
    const wrapper = shallow(
      <ViewDependentsApp fetchAllDependents={fetchAllDependentsMock}>
        <div>App Children</div>
      </ViewDependentsApp>,
    );
    expect(wrapper.find('RequiredLoginView').length).to.equal(1);
    wrapper.unmount();
  });
});
