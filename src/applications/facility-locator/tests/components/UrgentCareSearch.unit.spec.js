import { expect } from 'chai';
import { shallow } from 'enzyme';
import { urgentCareCall } from '../../components/SearchResult';
import { CLINIC_URGENTCARE_SERVICE, LocationType } from '../../constants';
import { urgentCareProviderNames } from '../../components/ProviderServiceDescription';

describe('UrgentCareSearch', () => {
  it('Should not render urgent care call.', () => {
    const urgentCallNotReturn = urgentCareCall({});
    expect(urgentCallNotReturn).to.equal(null);
  });

  it('Should render urgentCareCall in result item - cc_provider, urgent_care_service ', () => {
    const urgentCall = urgentCareCall({
      facilityType: LocationType.CC_PROVIDER,
      serviceType: CLINIC_URGENTCARE_SERVICE,
    });
    const wrapper = shallow(urgentCall);
    expect(wrapper.type()).to.not.equal(null);
    const p = wrapper.find('p');
    expect(p.length).to.equal(1);
    expect(p.text()).to.be.a('string');
    wrapper.unmount();
  });

  it('Should render urgentCareCall in result item - urgent_care, non_va_urgentcare  ', () => {
    const urgentCall = urgentCareCall({
      facilityType: LocationType.URGENT_CARE,
      serviceType: 'NonVAUrgentCare',
    });
    const wrapper = shallow(urgentCall);
    expect(wrapper.type()).to.not.equal(null);
    const p = wrapper.find('p');
    expect(p.length).to.equal(1);
    expect(p.text()).to.be.a('string');
    wrapper.unmount();
  });

  it('Should not render urgent care call with invalid facility/service types', () => {
    const urgentCallInvalid = urgentCareCall({
      facilityType: 'TestInvalid',
      serviceType: 'TestInvalid',
    });
    expect(urgentCallInvalid).to.equal(null);
  });

  it('Should return correct labels for urgent care (UrgentCare, WalkIn)', () => {
    const walkIn = urgentCareProviderNames(17);
    const urgentCare1 = urgentCareProviderNames(20);
    expect(walkIn).to.equal('RETAIL/WALK-IN CARE');
    expect(urgentCare1).to.equal('URGENT CARE');
    const urgentCare2 = urgentCareProviderNames(undefined);
    expect(urgentCare2).to.equal('URGENT CARE');
  });
});
