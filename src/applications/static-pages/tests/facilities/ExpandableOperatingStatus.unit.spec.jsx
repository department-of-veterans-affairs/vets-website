import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ExpandableOperatingStatus from '../../shared/ExpandableOperatingStatus';

describe('<ExpandableOperatingStatus>', () => {
  //      let status;
  //       let iconType;
  //
  //       switch (el.attributes.status.nodeValue) {
  //         case 'limited':
  //           status = 'Limited services and hours';
  //           iconType = 'triangle';
  //           break;
  //         case 'closed':
  //           status = 'Facility closed';
  //           iconType = 'circle';
  //           break;
  //         case 'notice':
  //           status = 'Facility notice';
  //           iconType = 'circle';
  //           break;
  //         default:
  //           status = 'Facility status';
  //           iconType = 'triangle';
  //       }

  it('Should render ExpandableOperatingStatus', () => {
    const eventSpy = sinon.spy();
    const wrapper = shallow(
      <ExpandableOperatingStatus
        eventSpy={eventSpy}
        operatingStatusFacility={'limited'}
        iconType={'triangle'}
        statusLabel={'Limited services and hours'}
        extraInfo={
          'Lorem ipsum dolor sit amet, pro soluta utroque gubergren in. Ea cum delenit dissentiet. Sint tamquam dolorum ' +
          'vis et, pri ei doctus mentitum convenire. Atqui dolorum feugait nam ea, est explicari signiferumque no. ' +
          'Dicam perpetua dissentias ei pri, quem denique rationibus eam in. ' +
          'Etiam zril deterruisset ea per, posse idque vel ei.'
        }
      />,
    );

    expect(wrapper.type()).to.not.equal(null);
    expect(wrapper.find('.status-label').text()).to.equal(
      'Limited services and hours',
    );
    expect(
      wrapper.find('.alert-icon-base').hasClass('fa-exclamation-triangle'),
    ).to.equal(true);

    // const div = wrapper.find('div');
    // const button = div.find('button');

    // console.log(button.debug());

    // button.simulate('click');
    // expect(eventSpy.calledOnce).toBe(true);

    wrapper.unmount();
  });
});
