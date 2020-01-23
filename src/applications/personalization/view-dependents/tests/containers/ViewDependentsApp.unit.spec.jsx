import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ViewDependentsApp } from '../../containers/ViewDependentsApp';

describe('<ViewDependentsApp />', () => {
  it('should render a ViewDependentsLayout', () => {
    const wrapper = shallow(
      <ViewDependentsApp>
        <div>App Children</div>
      </ViewDependentsApp>,
    );
    expect(wrapper.find('ViewDependentsLayout').length).to.equal(1);
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
