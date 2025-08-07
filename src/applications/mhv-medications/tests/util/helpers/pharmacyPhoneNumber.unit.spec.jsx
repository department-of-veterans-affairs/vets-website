import { expect } from 'chai';
import { pharmacyPhoneNumber } from '../../../util/helpers';

describe('pharmacyPhoneNumber function', () => {
  const rx = {
    cmopDivisionPhone: '4436366919',
    dialCmopDivisionPhone: '1786366871',
    rxRfRecords: [
      {
        cmopDivisionPhone: null,
        dialCmopDivisionPhone: '',
      },
      {
        cmopDivisionPhone: '(465)895-6578',
        dialCmopDivisionPhone: '5436386958',
      },
    ],
  };
  it('should return a phone number when object passed has a phone for the cmopDivisionPhone field', () => {
    expect(pharmacyPhoneNumber(rx)).to.equal('4436366919');
  });
  it('should return a phone number when object passed has a phone for the dialCmopDivisionPhone field', () => {
    const newRxNoCmop = { ...rx, cmopDivisionPhone: null };
    expect(pharmacyPhoneNumber(newRxNoCmop)).to.equal('1786366871');
  });
  it('should return a phone number when object passed only has a phone for the cmopDivisionPhone field inside of the rxRfRecords array', () => {
    const newRxNoDialCmop = {
      ...rx,
      cmopDivisionPhone: null,
      dialCmopDivisionPhone: null,
    };
    expect(pharmacyPhoneNumber(newRxNoDialCmop)).to.equal('(465)895-6578');
  });
  it('should return a phone number when object passed only has a phone for the dialCmopDivisionPhone field inside of the rxRfRecords array', () => {
    const newRxNoCmopInRxRfRecord = {
      ...rx,
      cmopDivisionPhone: null,
      dialCmopDivisionPhone: null,
      rxRfRecords: [
        {
          cmopDivisionPhone: null,
          dialCmopDivisionPhone: '',
        },
        {
          cmopDivisionPhone: null,
          dialCmopDivisionPhone: '5436386958',
        },
      ],
    };
    expect(pharmacyPhoneNumber(newRxNoCmopInRxRfRecord)).to.equal('5436386958');
  });
  it('should return null when object passed has no phone numbers for all the cmopDivisionPhone, dialCmopDivisionPhone fields', () => {
    const newRxNoCmopInRxRfRecord = {
      ...rx,
      cmopDivisionPhone: null,
      dialCmopDivisionPhone: null,
      rxRfRecords: [
        {
          cmopDivisionPhone: null,
          dialCmopDivisionPhone: '',
        },
        {
          cmopDivisionPhone: null,
          dialCmopDivisionPhone: null,
        },
      ],
    };
    expect(pharmacyPhoneNumber(newRxNoCmopInRxRfRecord)).to.equal(null);
  });
});
