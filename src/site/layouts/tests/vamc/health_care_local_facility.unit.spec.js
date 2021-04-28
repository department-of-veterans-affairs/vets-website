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

    // Default state, main phone number is in dataset
    it('should render main phone number', () => {
      expect(container.querySelector('.main-phone a').textContent).to.equal(
        data.fieldPhoneNumber,
      );
    });

    // Test return if the fieldPhoneNumber string is empty
    it('should not render .main-phone if string is empty', async () => {
      // Clear fieldPhoneNumber to mimic an entry error
      data.fieldPhoneNumber = '';
      container = await renderHTML(layoutPath, data, 'fieldPhoneNumberEmpty');

      // Element should not render in the DOM
      expect(container.querySelector('.main-phone')).to.be.null;
    });

    // Test return if the fieldPhoneNumber is null
    it('should not render .main-phone if null', async () => {
      // Set fieldPhoneNumber to null value
      data.fieldPhoneNumber = null;
      container = await renderHTML(layoutPath, data, 'fieldPhoneNumberNull');

      // Element should not render in the DOM
      expect(container.querySelector('.main-phone')).to.be.null;
    });
  });
});
