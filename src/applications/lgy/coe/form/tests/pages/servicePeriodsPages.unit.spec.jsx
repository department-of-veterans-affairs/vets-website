import { expect } from 'chai';
import { servicePeriodsPages } from '../../pages/servicePeriodsPages';

describe('COE servicePeriods array builder pages', () => {
  it('includes the intro, item, and summary pages', () => {
    expect(servicePeriodsPages).to.have.property('servicePeriodsIntro');
    expect(servicePeriodsPages).to.have.property('servicePeriodsItem');
    expect(servicePeriodsPages).to.have.property('servicePeriodsSummary');
  });

  it('requires the summary yes/no field', () => {
    const { schema } = servicePeriodsPages.servicePeriodsSummary;
    expect(schema.required).to.deep.equal(['view:hasServicePeriods']);
  });

  it('uses the rebuild paths', () => {
    expect(servicePeriodsPages.servicePeriodsIntro.path).to.equal(
      'service-history-rebuild',
    );
    expect(servicePeriodsPages.servicePeriodsSummary.path).to.equal(
      'service-history-rebuild-summary',
    );
    expect(servicePeriodsPages.servicePeriodsItem.path).to.equal(
      'service-history-rebuild/:index/service-period',
    );
  });
});
