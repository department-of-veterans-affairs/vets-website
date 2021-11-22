import { expect } from 'chai';
import { mount } from 'enzyme';

import {
  addressToDisplay,
  formatPhoneNumber,
  stateCodeToFullState,
} from '../../../components/veteran-info/utils';

describe('health care questionnaire -- veterans information utils --', () => {
  it('stateCodeToFullState -- good data', () => {
    const value = stateCodeToFullState('PA');

    expect(value).to.equal('Pennsylvania');
  });
  it('stateCodeToFullState -- missing data', () => {
    const value = stateCodeToFullState(undefined);

    expect(value).to.equal(undefined);
  });
  it('stateCodeToFullState -- bad data', () => {
    const value = stateCodeToFullState('NOT A STATE CODE');

    expect(value).to.equal(undefined);
  });

  it('formatPhoneNumber -- valid phone number', () => {
    const number = '1231231234';
    const formatted = formatPhoneNumber(number);

    expect(formatted).to.equal('123-123-1234');
  });
  it('formatPhoneNumber -- invalid phone number', () => {
    const number = '123123123';
    const formatted = formatPhoneNumber(number);

    expect(formatted).to.equal(null);
  });
  it('formatPhoneNumber -- missing phone number', () => {
    const formatted = formatPhoneNumber(undefined);

    expect(formatted).to.equal(null);
  });

  it('addressToDisplay -- no data', () => {
    const label = 'my label';
    const display = addressToDisplay(label, undefined);
    expect(display).to.eql({ label });
  });
  it('addressToDisplay -- all data', () => {
    const address = {
      addressLine1: '123 Fake Street',
      city: 'DoesNotExistVille',
      stateCode: 'PA',
      zipCode: '12345',
    };
    const label = 'my label';

    const display = addressToDisplay(label, address);
    const component = mount(display.value);
    expect(component.find('span.address').text()).to.equal('123 Fake Street');
    expect(component.find('span.city-state-zip').text()).to.equal(
      'DoesNotExistVille, PA 12345',
    );
    component.unmount();
  });
});
