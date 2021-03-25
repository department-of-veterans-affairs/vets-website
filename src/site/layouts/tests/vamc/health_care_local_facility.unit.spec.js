import { expect } from 'chai';
import { parseFixture, renderHTML } from '~/site/tests/support';
import axeCheck from '~/site/tests/support/axe';

const layoutPath = 'src/site/layouts/health_care_local_facility.drupal.liquid';

// part of option 1
parseFixture.bind(this);

describe('health_care_local_facility', () => {
  // TODO extend tests with more suites
  describe('PhoneNumbers', () => {
    let container;

    // option 1: bind this to parseFixture() (see above);
    // call this.skip() in parseFixture()
    const data = parseFixture(
      'src/site/layouts/tests/vamc/fixtures/health_care_local_facility_no_phone_mental.json',
    );
    // end option 1

    // option 2: bind this to parseFixture() here
    // call this.skip() in parseFixture()
    // const data = parseFixture(
    //   'src/site/layouts/tests/vamc/fixtures/health_care_local_facility_no_phone_mental.json',
    // ).bind(this);
    // end option 2

    // option 3: don't bind this to parseFixture()
    // call this.skip() if the return value of parseFixture() is falsey (see below)
    // const data = parseFixture(
    //   'src/site/layouts/tests/vamc/fixtures/health_care_local_facility_no_phone_mental.json',
    // );

    // if (!data) {
    //   this.skip();
    // }
    // end option 3

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
