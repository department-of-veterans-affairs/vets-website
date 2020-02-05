import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ViewDependentsApp } from '../../containers/ViewDependentsApp';

describe('<ViewDependentsApp />', () => {
  it('should render a ViewDependentsLayout', () => {
    const stub = sinon.stub(ViewDependentsApp.prototype, 'fetchAllDependents');
    const wrapper = shallow(
      <ViewDependentsApp>
        <div>App Children</div>
      </ViewDependentsApp>,
    );
    expect(wrapper.find('ViewDependentsLayout').length).to.equal(1);
    expect(stub.calledOnce).to.be.true;
    wrapper.unmount();
  });

  it('should render a RequiredLoginView', () => {
    const wrapper = shallow(
      <ViewDependentsApp>
        <div>App Children</div>
      </ViewDependentsApp>,
    );
    expect(wrapper.find('RequiredLoginView').length).to.equal(1);
    wrapper.unmount();
  });
});
