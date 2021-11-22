import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import AuthedWelcomeMessage from '../AuthedWelcomeMessage';

describe('health care questionnaire - introduction page - welcome message', () => {
  it('uses action link', () => {
    const wrapper = mount(<AuthedWelcomeMessage />);
    expect(wrapper.exists('PrimaryActionLink')).to.be.true;
    wrapper.unmount();
  });
  it('calls the next page property on click', () => {
    const goToFirstPage = sinon.spy();
    const component = mount(
      <AuthedWelcomeMessage goToFirstPage={goToFirstPage} />,
    );
    const pal = component.find('PrimaryActionLink');
    expect(pal.exists()).to.be.true;
    expect(pal.props()).to.have.property('onClick');
    pal.props().onClick();
    expect(goToFirstPage.called).to.be.true;
    component.unmount();
  });
});
