import { expect } from 'chai';
import { parsePhoneNumber } from '../../utils/phoneNumbers';

describe('parsePhoneNumber', () => {
  it('without extension, without dashes', () => {
    const phone = '1234567890';
    const { formattedPhoneNumber, extension, contact } = parsePhoneNumber(
      phone,
    );
    expect(formattedPhoneNumber).to.equal('123-456-7890');
    expect(extension).to.equal('');
    expect(contact).to.equal('1234567890');
  });

  it('with extension, without dashes', () => {
    const phone = '1234567890 x123';
    const { formattedPhoneNumber, extension, contact } = parsePhoneNumber(
      phone,
    );
    expect(formattedPhoneNumber).to.equal('123-456-7890 x123');
    expect(extension).to.equal('123');
    expect(contact).to.equal('1234567890');
  });

  it('with dashes', () => {
    const phone = '123-456--7890';
    const { formattedPhoneNumber, extension, contact } = parsePhoneNumber(
      phone,
    );
    expect(formattedPhoneNumber).to.equal('123-456-7890');
    expect(extension).to.equal('');
    expect(contact).to.equal('1234567890');
  });

  it('with spaces and extension', () => {
    const phone = '123  456 7890 Extension 123';
    const { formattedPhoneNumber, extension, contact } = parsePhoneNumber(
      phone,
    );
    expect(formattedPhoneNumber).to.equal('123-456-7890 x123');
    expect(extension).to.equal('123');
    expect(contact).to.equal('1234567890');
  });

  it('with 800 numbers', () => {
    const phone = '1-800-827-1000';
    const { formattedPhoneNumber, extension, contact } = parsePhoneNumber(
      phone,
    );
    expect(formattedPhoneNumber).to.equal('800-827-1000');
    expect(extension).to.equal('');
    expect(contact).to.equal('8008271000');
  });
});
