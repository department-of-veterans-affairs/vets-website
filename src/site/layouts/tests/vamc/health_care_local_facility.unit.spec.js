import { expect } from 'chai';
import { parseFixture, renderHTML } from '~/site/tests/support';
import axeCheck from '~/site/tests/support/axe';

const layoutPath = 'src/site/layouts/health_care_local_facility.drupal.liquid';

describe('health_care_local_facility', () => {
  // TODO extend tests with more suites
  describe('PhoneNumbers', () => {
    let container;
    const data = parseFixture(
      'src/site/layouts/tests/vamc/fixtures/health_care_local_facility_no_phone_mental.json',
    );

    before(async () => {
      container = await renderHTML(layoutPath, data);
    });

    it('reports no axe violations', async () => {
      const violations = await axeCheck(container);
      expect(violations.length).to.equal(0);
    });

    it('should not render .mental-health-clinic-phone', () => {
      expect(container.querySelector('.mental-health-clinic-phone')).to.be.null;
    });
  });
});
