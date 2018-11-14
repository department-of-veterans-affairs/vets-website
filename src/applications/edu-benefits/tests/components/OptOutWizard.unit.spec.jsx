import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import OptOutWizard from '../../components/OptOutWizard';

describe('<OptOutWizard>', () => {
  it('should show opt out button', () => {
    const component = mount(<OptOutWizard />);

    expect(component.find('button').length).to.equal(1);
    expect(component.state('modalOpen')).to.be.false;
  });
  it('should show modal when opt out button is clicked', () => {
    // Modal uses query selector to get focus
    const oldQuerySelector = global.document.querySelector;
    global.document.querySelector = () => global.document;
    global.document.focus = () => true;

    const component = mount(<OptOutWizard />);

    component.find('button').simulate('click');
    component.update();
    expect(component.state('modalOpen')).to.be.true;
    expect(component.find('button').length).to.equal(3);
    expect(component.find('a').length).to.equal(2);

    delete global.document.focus;
    global.document.querySelector = oldQuerySelector;
  });
  it('should close modal', () => {
    // Modal uses query selector to get focus
    const oldQuerySelector = global.document.querySelector;
    global.document.querySelector = () => global.document;
    global.document.focus = () => true;

    const component = mount(<OptOutWizard />);

    component.find('button').simulate('click');
    component.update();
    component
      .find('button')
      .last()
      .simulate('click');
    component.update();

    expect(component.find('button').length).to.equal(1);
    expect(component.state('modalOpen')).to.be.false;

    delete global.document.focus;
    global.document.querySelector = oldQuerySelector;
  });
});
