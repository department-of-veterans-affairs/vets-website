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

  it('Should display Covid19 vaccine as COVID-19 vaccines', () => {
    const serviceTest = formatServiceName('Covid19 vaccine');
    expect(serviceTest).to.equal('COVID-19 vaccines');
  });
});
