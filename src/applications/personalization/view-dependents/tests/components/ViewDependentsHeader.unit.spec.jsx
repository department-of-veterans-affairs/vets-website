import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { ViewDependentsHeader } from '../../components/ViewDependentsHeader/ViewDependentsHeader';

describe('<ViewDependentsHeader />', () => {
  it('Should Render', () => {
    const url = path => path;
    const wrapper = shallow(<ViewDependentsHeader eBenefitsUrl={url} />);

    expect(wrapper.contains(<h1>Your VA Dependents</h1>)).to.equal(true);
    wrapper.unmount();
  });
});
