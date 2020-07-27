import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import AccessToCare from '../../components/AccessToCare';

describe('<AccessToCare>', () => {
  const testFacility = {
    id: 'vha_674BY',
    type: 'facility',
    attributes: {
      access: {
        health: [],
        effectiveDate: '2020-07-13',
      },
      feedback: {
        health: {
          primaryCareUrgent: 0.6000000238418579,
          primaryCareRoutine: 0.7900000214576721,
        },
        effectiveDate: '2019-06-20',
      },
      id: 'vha_674BY',
      name: 'Austin VA Clinic',
      facilityType: 'va_health_facility',
    },
  };

  it('Should render access care component', () => {
    const wrapper = shallow(<AccessToCare location={testFacility} />);
    expect(wrapper.type()).to.not.equal(null);
    wrapper.unmount();
  });
});
