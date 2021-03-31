import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import ViewAndPrint from '../ViewAndPrint';

describe('health care questionnaire list - shows view and print button', () => {
  it('renders', () => {
    const component = mount(<ViewAndPrint />);
    expect(component.exists('.va-button')).to.be.true;
    component.unmount();
  });
  it('has accessability aria-label', () => {
    const component = mount(
      <ViewAndPrint
        facilityName="Magic Kingdom"
        appointmentTime="2021-10-31T17:00:00Z"
      />,
    );
    expect(component.exists('.va-button')).to.be.true;
    expect(
      component.find('[data-testid="print-button"]').prop('aria-label'),
    ).to.equal(
      'Download your response to the questionnaire you submitted for your appointment at Magic Kingdom that was on October, 31, 2021',
    );
    component.unmount();
  });
  it('onClick is added to the button', () => {
    const onClick = sinon.spy();
    const component = mount(<ViewAndPrint onClick={onClick} />);
    expect(component.exists('.va-button')).to.be.true;
    component
      .find('.va-button')
      .at(0)
      .simulate('click');
    expect(onClick.called).to.be.true;
    component.unmount();
  });
  it('hides arrow', () => {
    const component = mount(<ViewAndPrint displayArrow={false} />);
    expect(component.exists('.va-button>i')).to.be.false;
    component.unmount();
  });
  it('shows arrow', () => {
    const component = mount(<ViewAndPrint displayArrow />);
    expect(component.exists('.va-button>i')).to.be.true;
    component.unmount();
  });
});
