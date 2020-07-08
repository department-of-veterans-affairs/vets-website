import { expect } from 'chai';
import { shallow } from 'enzyme';
import { urgentCareCall } from '../../components/SearchResult';
import { CLINIC_URGENTCARE_SERVICE, LocationType } from '../../constants';

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
});
