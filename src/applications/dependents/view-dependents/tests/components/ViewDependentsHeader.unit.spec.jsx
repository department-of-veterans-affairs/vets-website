import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ViewDependentsHeader from '../../components/ViewDependentsHeader/ViewDependentsHeader';
import { PAGE_TITLE } from '../../util';

describe('<ViewDependentsHeader />', () => {
  it('Should Render', () => {
    const wrapper = shallow(<ViewDependentsHeader />);

    expect(wrapper.contains(<h1>{PAGE_TITLE}</h1>)).to.equal(true);
    wrapper.unmount();
  });
});
