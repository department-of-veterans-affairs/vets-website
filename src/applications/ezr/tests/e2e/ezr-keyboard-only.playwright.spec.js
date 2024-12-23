import { test, expect } from '@playwright/test';
import { format, subYears } from 'date-fns';
import manifest from '../../manifest.json';
import mockPrefill from './fixtures/mocks/mock-prefill.json';
import maxTestData from './fixtures/data/maximal-test.json';
import {
  fillAddressWithKeyboard,
  fillNameWithKeyboard,
  fillDateWithKeyboard,
  selectRadioWithKeyboard,
  selectDropdownWithKeyboard,
} from './helpers';

const MOCK_ENROLLMENT_RESPONSE = {
  applicationDate: '2019-04-24T00:00:00.000-06:00',
  enrollmentDate: '2019-04-30T00:00:00.000-06:00',
  preferredFacility: '463 - CHEY6',
  parsedStatus: 'enrolled',
  effectiveDate: '2019-04-25T00:00:00.000-06:00',
  canSubmitFinancialInfo: true,
};

const VA_FORM_IDS = Object.freeze({
  FEEDBACK_TOOL: 'FEEDBACK-TOOL',
  FORM_0873: '0873',
  FORM_10_10CG: '10-10CG',
  FORM_10_10D: '10-10D',
  FORM_10_10EZ: '1010ez',
  FORM_10_10EZR: '10-10EZR',
  FORM_10_3542: '10-3542',
  FORM_10_7959A: '10-7959A',
  FORM_10_7959C: '10-7959C',
  FORM_10_7959F_1: '10-7959F-1',
  FORM_10_7959F_2: '10-7959F-2',
  FORM_10182: '10182',
  FORM_20_0995: '20-0995',
  FORM_20_0996: '20-0996',
  FORM_20_10206: '20-10206',
  FORM_20_10207: '20-10207',
  FORM_21_0845: '21-0845',
  FORM_21_0966: '21-0966',
  FORM_21_0972: '21-0972',
  FORM_21_10210: '21-10210',
  FORM_21_22: '21-22',
  FORM_21_22A: '21-22a',
  FORM_21_4138: '21-4138',
  FORM_21_4142: '21-4142',
  FORM_21_526EZ: '21-526EZ',
  FORM_21_686C: '686C-674',
  FORM_21_686CV2: '686C-674-V2',
  FORM_21A: '21a',
  FORM_21P_0847: '21P-0847',
  FORM_21P_0969: '21P-0969',
  FORM_21P_527EZ: '21P-527EZ',
  FORM_21P_530: '21P-530',
  FORM_21P_530V2: '21P-530V2',
  FORM_22_0993: '22-0993',
  FORM_22_0994: '22-0994',
  FORM_22_10203: '22-10203',
  FORM_22_10215: '22-10215',
  FORM_22_10216: '22-10216',
  FORM_22_10282: '22-10282',
  FORM_22_1990: '22-1990',
  FORM_22_1990EMEB: '22-1990EMEB',
  FORM_22_1990EZ: '22-1990EZ',
  FORM_22_1995: '22-1995',
  FORM_22_1995S: '22-1995S',
  FORM_22_5490: '22-5490',
  FORM_22_5490E: '22-5490E',
  FORM_22_8794: '22-8794',
  FORM_26_1880: '26-1880',
  FORM_26_4555: '26-4555',
  FORM_28_1900: '28-1900',
  FORM_28_8832: '28-8832',
  FORM_40_0247: '40-0247',
  FORM_40_10007: '40-10007',
  FORM_5655: '5655',
  FORM_1919: '22-1919',
  FORM_COVID_VACCINATION_EXPANSION: 'COVID-VACCINATION-EXPANSION',
  FORM_COVID_VACCINE_TRIAL_UPDATE: 'COVID-VACCINE-TRIAL-UPDATE',
  FORM_COVID_VACCINE_TRIAL: 'COVID-VACCINE-TRIAL',
  FORM_FORM_UPLOAD_FLOW: 'FORM-UPLOAD-FLOW',
  FORM_HC_QSTNR: 'HC-QSTNR',
  FORM_MOCK_ALT_HEADER: 'FORM_MOCK_ALT_HEADER',
  FORM_MOCK_APPEALS: 'FORM_MOCK_APPEALS',
  FORM_MOCK_HLR: 'FORM_MOCK_HLR',
  FORM_MOCK_MINIMAL_HEADER: 'FORM-MOCK-MINIMAL-HEADER',
  FORM_MOCK_PATTERNS_V3: 'FORM_MOCK_PATTERNS_V3',
  FORM_MOCK_SF_PATTERNS: 'FORM_MOCK_SF_PATTERNS',
  FORM_MOCK: '00-1234',
  FORM_T_QSTNR: 'T-QSTNR',
  FORM_VA_2346A: 'MDOT',
  FORM_XX_123: 'XX-123',
  FORM_MOCK_AE_DESIGN_PATTERNS: 'FORM-MOCK-AE-DESIGN-PATTERNS',
  FORM_WELCOME_VA_SETUP_REVIEW_INFORMATION:
    'WELCOME_VA_SETUP_REVIEW_INFORMATION',
});
const CSP_IDS = {
  MHV: 'mhv',
  MHV_VERBOSE: 'myhealthevet',
  ID_ME: 'idme',
  DS_LOGON: 'dslogon',
  LOGIN_GOV: 'logingov',
  VAMOCK: 'vamock',
};

const mockUser = {
  data: {
    id: '',
    type: 'users_scaffolds',
    attributes: {
      account: {
        account_uuid: '777bfa-2cbb-98fc-zz-9231fbac',
      },
      profile: {
        sign_in: {
          service_name: CSP_IDS.DS_LOGON,
          account_type: '2',
          ssoe: false,
        },
        email: 'fake@fake.com',
        loa: { current: 3 },
        first_name: 'Jane',
        middle_name: '',
        last_name: 'Doe',
        gender: 'F',
        birth_date: '1985-01-01',
        verified: true,
        authn_context: 'dslogon',
        multifactor: true,
        zip: '21076',
        last_signed_in: '2022-05-18T22:02:02.188Z',
      },
      veteran_status: {
        status: 'OK',
        is_veteran: true,
        served_in_military: true,
      },
      in_progress_forms: [
        {
          form: VA_FORM_IDS.FORM_10_10EZ,
          metadata: {},
        },
      ],
      prefills_available: [VA_FORM_IDS.FORM_21_526EZ],
      services: [
        'facilities',
        'hca',
        'edu-benefits',
        'evss-claims',
        'lighthouse',
        'form526',
        'user-profile',
        'health-records',
        'rx',
        'messaging',
      ],
      va_profile: {
        status: 'OK',
        birth_date: '19850101',
        family_name: 'Doe',
        gender: 'F',
        given_names: ['Jane', 'E'],
        active_status: 'active',
        facilities: [
          {
            facility_id: '983',
            isCerner: false,
          },
          {
            facility_id: '984',
            isCerner: false,
          },
        ],
        is_cerner_patient: false,
        va_patient: true,
        mhv_account_state: 'OK',
      },
    },
  },
  meta: { errors: null },
};

test.describe('Form 10-10EZR Keyboard Only', () => {
  test.beforeEach(async ({ page }) => {
    // cy.login()
    await page.route('**/v0/user', route => {
      route.fulfill({ json: mockUser });
    });

    await page.route('**/v0/feature_toggles*', route => {
      route.fulfill({
        path:
          './src/applications/ezr/tests/e2e/fixtures/mocks/mock-features.json',
      });
    });
    await page.route(
      '**/v0/health_care_applications/enrollment_status',
      route => route.fulfill({ json: MOCK_ENROLLMENT_RESPONSE }),
    );
    await page.route('**/v0/maintenance_windows/', route => {
      route.fulfill({ json: {} });
    });
    await page.route('**/v0/in_progress_forms/10-10EZR', route => {
      if (route.request().method() === 'PUT') {
        route.fulfill({ json: {} });
      }
      route.fulfill({ json: mockPrefill });
    });
    await page.route(`**/v0/form1010_ezrs`, route =>
      route.fulfill({
        json: {
          formSubmissionId: '123fake-submission-id-567',
          timestamp: '2023-11-01',
        },
      }),
    );
  });

  test('should navigate and input maximal data using only a keyboard', async ({
    page,
  }) => {
    const { data } = maxTestData;
    await page.goto('/');
    await page.evaluate("window.localStorage.setItem('hasSession', true)");
    const hasSession = await page.evaluate(
      "window.localStorage.getItem('hasSession')",
    );
    console.log('hasSession', hasSession);
    await page.goto(manifest.rootUrl);

    // Wait for the necessary requests to complete
    await page.waitForResponse('**/v0/in_progress_forms/10-10EZR');

    // Inject Axe for accessibility checks
    await page.addScriptTag({ path: require.resolve('axe-core') });
    await page.evaluate(async () => {
      await axe.run();
    });

    // Use the helper functions to fill the form
    await fillAddressWithKeyboard(page, 'addressField', data.address);
    await fillNameWithKeyboard(page, 'nameField', data.name);
    await fillDateWithKeyboard(page, 'dateField', data.date);
    await selectRadioWithKeyboard(page, 'radioField', data.radioValue);
    await selectDropdownWithKeyboard(page, 'dropdownField', data.dropdownValue);

    // Other toxic exposure details
    if (data.otherToxicExposure) {
      await page
        .locator('[name="root_otherToxicExposure"]')
        .fill(data.otherToxicExposure);
    }
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Other toxic exposure dates
    const { toxicExposureStartDate, toxicExposureEndDate } = data[
      'view:toxicExposureDates'
    ];
    let [year, month] = toxicExposureStartDate
      .split('-')
      .map(num => parseInt(num, 10).toString());
    await page
      .locator(
        '[name="root_view:toxicExposureDates_toxicExposureStartDateMonth"]',
      )
      .selectOption({ label: month });
    await page
      .locator(
        '[name="root_view:toxicExposureDates_toxicExposureStartDateYear"]',
      )
      .fill(year);

    [year, month] = toxicExposureEndDate
      .split('-')
      .map(num => parseInt(num, 10).toString());
    await page
      .locator(
        '[name="root_view:toxicExposureDates_toxicExposureEndDateMonth"]',
      )
      .selectOption({ label: month });
    await page
      .locator('[name="root_view:toxicExposureDates_toxicExposureEndDateYear"]')
      .fill(year);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Toxic exposure document upload, skip for now
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Marital status
    const { maritalStatus } = data['view:maritalStatus'];
    await selectDropdownWithKeyboard(
      page,
      'view:maritalStatus_maritalStatus',
      maritalStatus,
    );
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Spouse's basic info
    await fillNameWithKeyboard(page, 'spouseFullName', data.spouseFullName);
    if (data.spouseFullName) {
      await page
        .locator('[name="root_spouseFullName_first"]')
        .fill(data.spouseFullName.first);
      await page
        .locator('[name="root_spouseFullName_middle"]')
        .fill(data.spouseFullName.middle);
      await page
        .locator('[name="root_spouseFullName_last"]')
        .fill(data.spouseFullName.last);
      if (data.spouseFullName.suffix) {
        await page
          .locator('[name="root_spouseFullName_suffix"]')
          .selectOption({ label: data.spouseFullName.suffix });
      }
    }

    // Spouse's addt'l info
    await selectRadioWithKeyboard(page, 'cohabitedLastYear', 'Y');
    await selectRadioWithKeyboard(page, 'sameAddress', 'N');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Spouse's contact info
    const { spouseAddress, spousePhone } = data[
      'view:spouseContactInformation'
    ];
    await fillAddressWithKeyboard(page, 'spouseAddress', spouseAddress);
    if (spousePhone) {
      await page.locator('[name="root_spousePhone"]').fill(spousePhone);
    }
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Dependents
    await selectRadioWithKeyboard(page, 'view:reportDependents', 'Y');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');

    // Dependent's basic info
    const dependent = data.dependents[0];
    await fillNameWithKeyboard(page, 'fullName', dependent.fullName);
    await selectDropdownWithKeyboard(
      page,
      'dependentRelation',
      dependent.dependentRelation,
    );
    if (dependent.socialSecurityNumber) {
      await page
        .locator('[name="root_socialSecurityNumber"]')
        .fill(dependent.socialSecurityNumber);
    }

    const birthYear = format(subYears(new Date(), 20), 'yyyy');
    await fillDateWithKeyboard(page, 'dateOfBirth', `${birthYear}-01-01`);
    await fillDateWithKeyboard(page, 'becameDependent', `${birthYear}-01-01`);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Dependent's addt'l info
    await selectRadioWithKeyboard(page, 'disabledBefore18', 'N');
    await selectRadioWithKeyboard(page, 'cohabitedLastYear', 'N');
    await selectRadioWithKeyboard(page, 'view:dependentIncome', 'Y');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Financial support for dependent
    await selectRadioWithKeyboard(page, 'receivedSupportLastYear', 'N');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Dependent's income
    let prefix = '[name="root_view:grossIncome_';
    await page.locator(`${prefix}grossIncome"]`).fill('20000');

    prefix = '[name="root_view:netIncome_';
    await page.locator(`${prefix}netIncome"]`).fill('10');

    prefix = '[name="root_view:otherIncome_';
    await page.locator(`${prefix}otherIncome"]`).fill('10');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Dependent's expenses
    await selectRadioWithKeyboard(page, 'attendedSchoolLastYear', 'Y');
    await page.locator('[name="root_dependentEducationExpenses"]').fill('453');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Review dependents
    await selectRadioWithKeyboard(page, 'view:reportDependents', 'N');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');

    // Veteran's income
    prefix = '[name="root_view:veteranGrossIncome_veteran';
    await page.locator(`${prefix}GrossIncome"]`).fill('3242434');

    prefix = '[name="root_view:veteranNetIncome_veteran';
    await page.locator(`${prefix}NetIncome"]`).fill('23424');

    prefix = '[name="root_view:veteranOtherIncome_veteran';
    await page.locator(`${prefix}OtherIncome"]`).fill('23424');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Spouse's income
    prefix = '[name="root_view:spouseGrossIncome_spouse';
    await page.locator(`${prefix}GrossIncome"]`).fill('23424');

    prefix = '[name="root_view:spouseNetIncome_spouse';
    await page.locator(`${prefix}NetIncome"]`).fill('23424');

    prefix = '[name="root_view:spouseOtherIncome_spouse';
    await page.locator(`${prefix}OtherIncome"]`).fill('23424');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Deductible expenses
    prefix = '[name="root_view:deductibleMedicalExpenses_deductible';
    await page.locator(`${prefix}MedicalExpenses"]`).fill('234');

    prefix = '[name="root_view:deductibleEducationExpenses_deductible';
    await page.locator(`${prefix}EducationExpenses"]`).fill('11');

    prefix = '[name="root_view:deductibleFuneralExpenses_deductible';
    await page.locator(`${prefix}FuneralExpenses"]`).fill('10');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Medicaid eligibility
    await selectRadioWithKeyboard(
      page,
      'view:isMedicaidEligible_isMedicaidEligible',
      'Y',
    );
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Medicare enrollment
    await selectRadioWithKeyboard(
      page,
      'view:isEnrolledMedicarePartA_isEnrolledMedicarePartA',
      'Y',
    );
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Medicare Part A effective date
    await fillDateWithKeyboard(
      page,
      'medicarePartAEffectiveDate',
      data.medicarePartAEffectiveDate,
    );
    if (data.medicareClaimNumber) {
      await page
        .locator('[name="root_medicareClaimNumber"]')
        .fill(data.medicareClaimNumber);
    }
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Health insurance coverage
    await selectRadioWithKeyboard(page, 'view:addInsurancePolicy', 'Y');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');

    const policy = data.providers[0];
    prefix = '[name="root_';
    if (policy.insuranceName) {
      await page.locator(`${prefix}insuranceName"]`).fill(policy.insuranceName);
    }
    if (policy.insurancePolicyHolderName) {
      await page
        .locator(`${prefix}insurancePolicyHolderName"]`)
        .fill(policy.insurancePolicyHolderName);
    }
    if (policy.insurancePolicyNumber) {
      await page
        .locator(`${prefix}view:policyOrGroup_insurancePolicyNumber"]`)
        .fill(policy.insurancePolicyNumber);
    }
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    await selectRadioWithKeyboard(page, 'view:addInsurancePolicy', 'N');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');

    // Review / Submit
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.locator('va-checkbox[name="privacyAgreementAccepted"]').click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Confirmation
    await expect(page).toHaveURL(/\/confirmation/);
  });
});
