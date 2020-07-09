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

  it('Should render urgentCareCall in result item.', () => {
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

  it('Should not render urgent care call with invalid facility/service types', () => {
    const urgentCallInvalid = urgentCareCall({
      facilityType: 'TestInvalid',
      serviceType: 'TestInvalid',
    });
    expect(urgentCallInvalid).to.equal(null);
  });

  it('Should return correct labels for urgent care (UrgentCare, WalkIn)', () => {
    const walkIn = urgentCareProviderNames(17);
    const urgentCare = urgentCareProviderNames(20);
    expect(walkIn).to.equal('RETAIL/WALK-IN CARE');
    expect(urgentCare).to.equal('URGENT CARE');
  });
});
