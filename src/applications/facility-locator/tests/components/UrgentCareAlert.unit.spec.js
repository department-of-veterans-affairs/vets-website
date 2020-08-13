import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import UrgentCareAlert from '../../containers/UrgentCareAlert';
import { showDialogUrgCare } from '../../utils/helpers';
import { CLINIC_URGENTCARE_SERVICE, LocationType } from '../../constants';

describe('<UrgentCareAlert>', () => {
  it('Should always render when used.', () => {
    const wrapper = shallow(<UrgentCareAlert />);
    expect(wrapper.type()).to.not.equal(null);
    const divs = wrapper.find('div');
    expect(divs.length).to.equal(2);
    const dl = wrapper.find('dl');
    expect(dl.length).to.equal(1);
    const dt = wrapper.find('dt');
    expect(dt.length).to.equal(1);
    const dd = wrapper.find('dd');
    expect(dd.length).to.equal(1);
    const button = wrapper.find('a');
    expect(button.length).to.equal(1);
    wrapper.unmount();
  });

  it('should render alert dialog calling showDialogUrgCare -  provider facility type & urgentcare service type ', () => {
    const dialogUrgentCare = showDialogUrgCare({
      facilityType: LocationType.CC_PROVIDER,
      serviceType: CLINIC_URGENTCARE_SERVICE,
    });
    const wrapper = shallow(dialogUrgentCare);
    expect(wrapper.type()).to.not.equal(null);
    wrapper.unmount();
  });

  it('should render alert dialog calling showDialogUrgCare -  urgent_care facility type & NonVAUrgentCare service type ', () => {
    const dialogUrgentCare = showDialogUrgCare({
      facilityType: LocationType.URGENT_CARE,
      serviceType: 'NonVAUrgentCare',
    });
    const wrapper = shallow(dialogUrgentCare);
    expect(wrapper.type()).to.not.equal(null);
    wrapper.unmount();
  });

  it('should not render alert dialog calling showDialogUrgCare when null ', () => {
    const dialogUrgentCareNull = showDialogUrgCare({
      facilityType: null,
      serviceType: null,
    });
    expect(dialogUrgentCareNull).to.equal(null);
  });
});
