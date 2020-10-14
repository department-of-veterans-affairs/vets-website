import { expect } from 'chai';

import {
  addressToDisplay,
  formatPhoneNumber,
  stateCodeToFullState,
} from '../../../components/veteran-info/utils';

describe('healthcare-questionnaire -- veterans information utils --', () => {
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
    const display = addressToDisplay(undefined);
    expect(display).to.eql([]);
  });
  it('addressToDisplay -- all data', () => {
    const address = {
      addressLine1: '123 Fake Street',
      addressLine2: 'Apt 203',
      addressLine3: 'The Nook below the stairs',
      city: 'DoesNotExistVille',
      stateCode: 'PA',
      zipCode: '12345',
    };
    const display = addressToDisplay(address);
    expect(display).to.eql([
      {
        label: 'Street Address 1',
        value: '123 Fake Street',
      },
      {
        label: 'Street Address 2',
        value: 'Apt 203',
      },
      {
        label: 'Street Address 3',
        value: 'The Nook below the stairs',
      },
      {
        label: 'City',
        value: 'DoesNotExistVille',
      },
      {
        label: 'State',
        value: 'Pennsylvania',
      },
      {
        label: 'Zip',
        value: '12345',
      },
    ]);
  });
});
