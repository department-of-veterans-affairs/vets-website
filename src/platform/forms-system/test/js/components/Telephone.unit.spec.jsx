import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Telephone, {
  CONTACTS,
  PATTERNS,
} from '../../../src/js/components/Telephone';

describe('Widget <Telephone />', () => {
  // custom numbers
  it('should render a number', () => {
    const wrapper = shallow(<Telephone contact="8005551212" />);
    const props = wrapper.props();
    expect(wrapper.type()).to.equal('a');
    expect(props.href).to.equal('tel:+18005551212');
    expect(props['aria-label']).to.equal('800. 5 5 5. 1 2 1 2');
    expect(wrapper.text()).to.equal('800-555-1212');
    wrapper.unmount();
  });
  it('should render a number with a leading "1"', () => {
    const wrapper = shallow(<Telephone contact="1-800-555-1000" />);
    const props = wrapper.props();
    expect(props.href).to.equal('tel:+18005551000');
    expect(props['aria-label']).to.equal('800. 5 5 5. 1000');
    expect(wrapper.text()).to.equal('800-555-1000');
    wrapper.unmount();
  });
  it('should throw an error when number does not match pattern', () => {
    expect(() => {
      const wrapper = shallow(<Telephone />);
      wrapper.unmount();
    }).to.throw('Contact number "" does not match the pattern (###-###-####)');
  });
  it('should throw an error when number is less than 10-digits', () => {
    expect(() => {
      const wrapper = shallow(<Telephone contact={4321} />);
      wrapper.unmount();
    }).to.throw(
      `Contact number "4321" does not match the pattern (###-###-####)`,
    );
  });
  it('should throw an error when number is more than 10-digits', () => {
    expect(() => {
      const wrapper = shallow(<Telephone contact="01234567891" />);
      wrapper.unmount();
    }).to.throw(
      'Contact number "01234567891" does not match the pattern (###-###-####)',
    );
  });

  // known numbers
  it('should render a known number', () => {
    const wrapper = shallow(<Telephone contact={CONTACTS.DS_LOGON} />);
    const props = wrapper.props();
    expect(props.href).to.equal('tel:+18005389552');
    expect(props['aria-label']).to.equal('800. 5 3 8. 9 5 5 2');
    expect(wrapper.text()).to.equal('800-538-9552');
    wrapper.unmount();
  });
  it('should render VA311 (a known number)', () => {
    const wrapper = shallow(<Telephone contact={CONTACTS.VA_311} />);
    const props = wrapper.props();
    expect(props.href).to.equal('tel:+18446982311');
    expect(props['aria-label']).to.equal('8 4 4. 6 9 8. 2 3 1 1');
    expect(wrapper.text()).to.equal('844-698-2311');
    wrapper.unmount();
  });
  it('should render 911 (a known number)', () => {
    const wrapper = shallow(<Telephone contact={CONTACTS['911']} />);
    const props = wrapper.props();
    expect(props.href).to.equal('tel:911');
    expect(props['aria-label']).to.equal('9 1 1');
    expect(wrapper.text()).to.equal('911');
    wrapper.unmount();
  });

  // className
  it('should render additional class name', () => {
    const wrapper = shallow(
      <Telephone contact={CONTACTS.GI_BILL} className="foo" />,
    );
    const props = wrapper.props();
    expect(props.href).to.equal('tel:+18884424551');
    expect(props['aria-label']).to.equal('8 8 8. 4 4 2. 4 5 5 1');
    expect(props.className).to.equal('no-wrap foo');
    expect(wrapper.text()).to.equal('888-442-4551');
    wrapper.unmount();
  });

  // pattern
  it('should render a custom pattern', () => {
    const wrapper = shallow(
      <Telephone contact={CONTACTS.GI_BILL} pattern={PATTERNS.WRAP_AREACODE} />,
    );
    const props = wrapper.props();
    expect(props.href).to.equal('tel:+18884424551');
    expect(props['aria-label']).to.equal('8 8 8. 4 4 2. 4 5 5 1');
    expect(wrapper.text()).to.equal('(888) 442-4551');
    wrapper.unmount();
  });
  it('should render a 7-digit custom pattern', () => {
    const wrapper = shallow(<Telephone contact="5551212" pattern="###_####" />);
    const props = wrapper.props();
    expect(props.href).to.equal('tel:5551212');
    expect(props['aria-label']).to.equal('5 5 5. 1 2 1 2');
    expect(wrapper.text()).to.equal('555_1212');
    wrapper.unmount();
  });
  it('should render a 3-digit custom pattern', () => {
    const wrapper = shallow(<Telephone contact="711" pattern="# # #" />);
    const props = wrapper.props();
    expect(props.href).to.equal('tel:711');
    // not sure if including a period and a space is a big deal; probably
    // an edge case either way
    expect(props['aria-label']).to.equal('7. 1. 1');
    expect(wrapper.text()).to.equal('7 1 1');
    wrapper.unmount();
  });

  // label
  it('should render a custom label string', () => {
    const ariaLabel = '800. 5 5 5. 12 12';
    const wrapper = shallow(
      <Telephone contact={CONTACTS.GI_BILL} ariaLabel={ariaLabel} />,
    );
    const props = wrapper.props();
    expect(props.href).to.equal('tel:+18884424551');
    expect(props['aria-label']).to.equal(ariaLabel);
    expect(wrapper.text()).to.equal('888-442-4551');
    wrapper.unmount();
  });

  // text
  it('should render a custom text string', () => {
    const wrapper = shallow(
      <Telephone contact={CONTACTS.GI_BILL}>1-888-GI-BILL-1</Telephone>,
    );
    const props = wrapper.props();
    expect(props.href).to.equal('tel:+18884424551');
    expect(props['aria-label']).to.equal('8 8 8. 4 4 2. 4 5 5 1');
    expect(wrapper.text()).to.equal('1-888-GI-BILL-1');
    wrapper.unmount();
  });

  // tracking
  it('should track on click', () => {
    const onClick = sinon.spy();
    const wrapper = shallow(
      <Telephone contact={CONTACTS.GI_BILL} onClick={onClick} />,
    );
    wrapper.simulate('click');
    expect(onClick.calledOnce).to.be.true;
    wrapper.unmount();
  });
});
