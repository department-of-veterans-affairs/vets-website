import { expect } from 'chai';

const phoneNumberArrayToObject = require('../phoneNumberArrayToObject');

describe('phoneNumberArrayToObject', () => {
  it('converts array to object correctly', () => {
    const phoneNumbers = [
      {
        entity: {
          fieldPhoneNumberType: 'phone',
          fieldPhoneNumber: '123-456-7890',
          fieldPhoneLabel: 'Residential Program',
        },
      },
      {
        entity: {
          fieldPhoneNumberType: 'phone',
          fieldPhoneNumber: '123-456-0001',
          fieldPhoneLabel: 'Outpatient Program',
          fieldPhoneExtension: '999',
        },
      },
      {
        entity: {
          fieldPhoneNumberType: 'fax',
          fieldPhoneNumber: '123-456-0002',
        },
      },
      {
        entity: {
          fieldPhoneNumberType: 'fax',
          fieldPhoneNumber: '123-456-0003',
        },
      },
      {
        entity: {
          fieldPhoneNumberType: 'sms',
          fieldPhoneNumber: '123-456-0004',
        },
      },
    ];

    const expected = {
      phone: [
        {
          fieldPhoneNumber: '123-456-7890',
          fieldPhoneLabel: 'Residential Program',
        },
        {
          fieldPhoneNumber: '123-456-0001',
          fieldPhoneLabel: 'Outpatient Program',
          fieldPhoneExtension: '999',
        },
      ],
      fax: [
        { fieldPhoneNumber: '123-456-0002' },
        { fieldPhoneNumber: '123-456-0003' },
      ],
      sms: [{ fieldPhoneNumber: '123-456-0004' }],
    };

    expect(phoneNumberArrayToObject(phoneNumbers)).to.eql(expected);
  });
});
