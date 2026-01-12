import { expect } from 'chai';
import { formatServiceName } from '../../utils/formatServiceName';

describe('formatServiceName', () => {
  it('Should convert camel case to sentence case', () => {
    const serviceTest = formatServiceName('Primary Care');
    expect(serviceTest).to.equal('Primary care');
  });

  it('Should not lowercase Veterans', () => {
    const serviceTest = formatServiceName('Help For Homeless Veterans');
    expect(serviceTest).to.equal('Help for homeless Veterans');
  });

  it('Should not lowercase Veterans', () => {
    const serviceTest = formatServiceName('Help for Homeless veterans');
    expect(serviceTest).to.equal('Help for homeless Veterans');
  });

  it('Should return null', () => {
    const serviceTest = formatServiceName(null);
    expect(serviceTest).to.be.null;
  });

  it('should return the correct option for ebenefits', () => {
    expect(formatServiceName('e benefits registration help')).to.equal(
      'eBenefits registration help',
    );
  });

  it('should return the correct option for home loan assistance', () => {
    expect(formatServiceName('v a home loan assistance')).to.equal(
      'VA home loan help',
    );
  });

  it('should return the correct option for disability evaluation', () => {
    expect(
      formatServiceName('Integrated disability evaluation system assistance'),
    ).to.equal('Integrated Disability Evaluation System (IDES) help');
  });

  it('should return the correct option for pre discharge claim help', () => {
    expect(formatServiceName('pre discharge claim assistance')).to.equal(
      'Pre-discharge claim help',
    );
  });

  it('should return the correct option for homeless assistance', () => {
    expect(formatServiceName('homeless assistance')).to.equal(
      'Help for homeless Veterans',
    );
  });

  it('should return the correct option for vocational rehabilitation', () => {
    expect(
      formatServiceName('vocational rehabilitation and employment help'),
    ).to.equal('Veteran Readiness and Employment help');
  });
});
