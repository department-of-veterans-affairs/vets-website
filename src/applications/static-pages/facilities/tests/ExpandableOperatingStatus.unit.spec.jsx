import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ExpandableOperatingStatus from '../vet-center/components/ExpandableOperatingStatus';

describe('<ExpandableOperatingStatus>', () => {
  it('Should render ExpandableOperatingStatus and be functional', () => {
    const wrapper = shallow(
      <ExpandableOperatingStatus
        operatingStatusFacility={'limited'}
        iconType={'exclamation-triangle'}
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

    const div = wrapper.find('div');
    const button = div.find('button');

    expect(wrapper.find('.content').hasClass('vads-u-display--none')).to.equal(
      true,
    );

    button.simulate('click');

    expect(wrapper.find('.content').hasClass('vads-u-display--block')).to.equal(
      true,
    );

    wrapper.unmount();
  });
});
