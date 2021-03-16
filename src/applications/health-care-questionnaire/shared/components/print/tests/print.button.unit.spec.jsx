import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import PrintButton from '../PrintButton';

describe('health care questionnaire list - shows view and print button', () => {
  it('renders, no error message', () => {
    const component = mount(<PrintButton />);
    expect(component.exists('.va-button')).to.be.true;
    component.unmount();
  });

  it('renders error message after click', () => {
    const component = mount(<PrintButton />);
    expect(component.exists('.va-button')).to.be.true;
    component
      .find('.va-button')
      .at(0)
      .simulate('click');
    expect(component.exists('.va-button')).to.be.false;

    expect(component.exists('[data-testid="service-down-message"]')).to.be.true;
    expect(
      component.find('[data-testid="call-to-action-container"]').text(),
    ).to.contain('Please refresh this page or try again later.');
    component.unmount();
  });

  it('renders error message with call to action after click', () => {
    const ErrorCallToAction = () => {
      return <span className="test">testing </span>;
    };
    const component = mount(
      <PrintButton ErrorCallToAction={ErrorCallToAction} />,
    );
    expect(component.exists('.va-button')).to.be.true;
    component
      .find('.va-button')
      .at(0)
      .simulate('click');
    expect(component.exists('.va-button')).to.be.false;
    expect(component.exists('.test')).to.be.true;
    expect(component.exists('[data-testid="service-down-message"]')).to.be.true;
    component.unmount();
  });
});
