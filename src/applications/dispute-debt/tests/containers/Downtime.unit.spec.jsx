import { expect } from 'chai';
import { externalServices } from 'platform/monitoring/DowntimeNotification';
import formConfig from '../../config/form';

describe('Dispute Debt - Downtime Implementation', () => {
  it('has downtime dependencies configured in formConfig', () => {
    expect(formConfig.downtime).to.exist;
    expect(formConfig.downtime.dependencies).to.be.an('array');
    expect(formConfig.downtime.dependencies.length).to.be.greaterThan(0);
  });

  // Verify the exact dependencies match expected services
  it('should verify formConfig downtime dependencies match expected services', () => {
    const { dependencies } = formConfig.downtime;

    expect(dependencies).to.include(externalServices.mvi);
    expect(dependencies).to.include(externalServices.vbs);
    expect(dependencies).to.include(externalServices.dmc);
    expect(dependencies).to.include(externalServices.vaProfile);
    expect(dependencies.length).to.equal(4);
  });
});
