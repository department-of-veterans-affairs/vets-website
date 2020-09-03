import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { FACILITY_TYPES } from '../../../../utils/constants';

import TypeOfAppointmentSection from '../../../../new-appointment/components/ReviewPage/TypeOfAppointmentSection';

describe('VAOS <TypeOfAppointmentSection>', () => {
  it('should render heading', () => {
    const data = { facilityType: FACILITY_TYPES.COMMUNITY_CARE };
    const tree = shallow(<TypeOfAppointmentSection data={data} />);

    expect(tree.text()).to.contain('Community Care');

    tree.unmount();
  });

  it('should render heading', () => {
    const data = { facilityType: 'garbage' };
    const tree = shallow(<TypeOfAppointmentSection data={data} />);

    expect(tree.text()).to.contain('VA Appointment');

    tree.unmount();
  });
});
