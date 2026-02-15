import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { form0781WorkflowChoices } from '../../content/form0781/workflowChoices';
import formConfig from '../../config/form';
import initialData from '../initialData';

const {
  schema,
  uiSchema,
  arrayPath,
} = formConfig.chapters.supportingEvidence.pages.privateMedicalRecordsRelease;

const claimType = {
  'view:claimType': {
    'view:claimingIncrease': true,
    'view:claimingNew': false,
  },
};
const newClaimTypeOnly = {
  'view:claimType': {
    'view:claimingNew': true,
  },
};
const ratedDisabilities = [
  {
    name: 'Post traumatic stress disorder',
    'view:selected': true,
  },
  {
    name: 'Intervertebral disc syndrome',
    'view:selected': true,
  },
  {
    name: 'Diabetes Melitus',
    'view:selected': true,
  },
];

const newDisabilities = [
  {
    cause: 'NEW',
    condition: 'asthma',
    'view:descriptionInfo': {},
  },
];

describe('Disability benefits 4142 provider medical records facility information', () => {
  it('should render 4142 form', () => {
    const { container } = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          initialData,
        }}
        uiSchema={uiSchema}
      />,
    );

    expect(container.querySelectorAll('va-text-input').length).to.equal(6);
    expect(container.querySelectorAll('va-checkbox').length).to.equal(1);
    expect(container.querySelectorAll('va-memorable-date').length).to.equal(2);
    expect(container.querySelectorAll('va-select').length).to.equal(1);
  });

  it('should add a provider facility', () => {
    const onSubmit = sinon.spy();
    // Create a facility provider object -> simulate what a user would enter for a facility
    const facilityProvider = {
      providerFacilityName: 'Local facility',
      treatedDisabilityNames: {
        diabetesmelitus: true,
      },
      treatmentDateRange: {
        from: '1950-01-03',
        to: '1950-12-31',
      },
      providerFacilityAddress: {
        country: 'USA',
        city: 'AnyCity',
        state: 'VA',
        postalCode: '12345',
        street: '123 Street',
      },
    };
    const { container } = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          initialData,
          ...claimType,
          ratedDisabilities,
          providerFacility: [facilityProvider],
        }}
        uiSchema={uiSchema}
      />,
    );

    const providerNameInput = $(
      'va-text-input[name="root_providerFacility_0_providerFacilityName"]',
      container,
    );
    expect(providerNameInput.getAttribute('value')).to.eq(
      facilityProvider.providerFacilityName,
    );

    const fromDate = $(
      'va-memorable-date[name="root_providerFacility_0_treatmentDateRange_from"]',
      container,
    );
    expect(fromDate.getAttribute('value')).to.eq('1950-1-3');

    const toDate = $(
      'va-memorable-date[name="root_providerFacility_0_treatmentDateRange_to"]',
      container,
    );
    expect(toDate.getAttribute('value')).to.eq('1950-12-31');

    expect(
      $('va-select[label="Country"]', container).getAttribute('value'),
    ).to.eq(facilityProvider.providerFacilityAddress.country);
    expect(
      $('va-select[label="State"]', container).getAttribute('value'),
    ).to.eq(facilityProvider.providerFacilityAddress.state);
    expect(
      $(
        'va-text-input[name="root_providerFacility_0_providerFacilityAddress_street"]',
        container,
      ).getAttribute('value'),
    ).to.eq(facilityProvider.providerFacilityAddress.street);
    expect(
      $(
        'va-text-input[name="root_providerFacility_0_providerFacilityAddress_city"]',
        container,
      ).getAttribute('value'),
    ).to.eq(facilityProvider.providerFacilityAddress.city);
    expect(
      $(
        'va-text-input[name="root_providerFacility_0_providerFacilityAddress_postalCode"]',
        container,
      ).getAttribute('value'),
    ).to.eq(facilityProvider.providerFacilityAddress.postalCode);

    expect(container.querySelectorAll('.usa-input-error').length).to.equal(0);
    expect(container.querySelectorAll('va-text-input').length).to.equal(5);
    expect(container.querySelectorAll('va-memorable-date').length).to.equal(2);
    expect(container.querySelectorAll('va-select').length).to.equal(2);

    const form = container.querySelector('form');
    if (form) {
      fireEvent.submit(form);
    }
    expect(onSubmit.called).to.be.true;
  });

  it('does not submit (and renders error messages) when no fields touched', async () => {
    const submit = sinon.spy();

    const { container } = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        formData={initialData}
        uiSchema={uiSchema}
      />,
    );

    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(submit.called).to.be.false;

      const providerName = $(
        'va-text-input[name="root_providerFacility_0_providerFacilityName"]',
        container,
      );
      expect(providerName.getAttribute('error')).to.exist;

      const fromDate = $(
        'va-memorable-date[name="root_providerFacility_0_treatmentDateRange_from"]',
        container,
      );
      expect(fromDate.getAttribute('error')).to.exist;

      expect(container.querySelectorAll('va-text-input').length).to.equal(6);
      expect(container.querySelectorAll('va-memorable-date').length).to.equal(
        2,
      );
      expect(container.querySelectorAll('va-select').length).to.equal(1);
      expect(container.querySelectorAll('va-checkbox').length).to.equal(1);
    });
  });

  it('does not submit (and renders error messages) when limited consent option chosen and no fields touched', async () => {
    const submit = sinon.spy();

    const { container } = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          'view:limitedConsent': true,
        }}
        formData={initialData}
        uiSchema={uiSchema}
      />,
    );

    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(submit.called).to.be.false;

      const providerName = $(
        'va-text-input[name="root_providerFacility_0_providerFacilityName"]',
        container,
      );
      expect(providerName.getAttribute('error')).to.exist;

      const limitedConsentField = $('va-textarea', container);
      if (limitedConsentField) {
        expect(limitedConsentField.getAttribute('error')).to.exist;
      }

      expect(container.querySelectorAll('va-text-input').length).to.be.at.least(
        6,
      );
      expect(container.querySelectorAll('va-checkbox').length).to.equal(1);
    });
  });

  it('should render with rated disabilities', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ...claimType,
          ratedDisabilities,
          'view:selectableEvidenceTypes': {
            'view:hasPrivateMedicalRecords': true,
          },
          disability526Enable2024Form4142: true,
        }}
      />,
    );

    expect(container.querySelectorAll('va-memorable-date').length).to.equal(2);
    expect(container.querySelectorAll('va-select').length).to.equal(1);

    // 1 for limited consent + 3 for treated disabilities
    expect(container.querySelectorAll('va-checkbox').length).to.equal(4);
  });
});

describe('updated 4142 provider medical records release', () => {
  it('should render the treated disability checkboxes section when disability526Enable2024Form4142 is true', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:uploadPrivateRecordsQualifier': {
            'view:hasPrivateRecordsToUpload': false,
          },
          ...claimType,
          ratedDisabilities,
          disability526Enable2024Form4142: true, // Simulating the condition
        }}
        formData={{}}
      />,
    );
    // 1 for the limited consent checkbox, 3 for the treated disabilities
    expect(container.querySelectorAll('va-checkbox').length).to.equal(4);
  });

  it('should not render the treated disability checkboxes section when disability526Enable2024Form4142 is false', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:uploadPrivateRecordsQualifier': {
            'view:hasPrivateRecordsToUpload': false,
          },
          ...claimType,
          ratedDisabilities,
          disability526Enable2024Form4142: false, // Simulating the condition
        }}
        formData={{}}
      />,
    );
    // 1 for the limited consent checkbox, 0 for the treated disabilities
    expect(container.querySelectorAll('va-checkbox').length).to.equal(1);
  });
});

describe('0781 question', () => {
  it('should render with 0781 questions when feature is enabled, user opted into 0781, and has new disabilites', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ...newClaimTypeOnly,
          newDisabilities,
          'view:selectableEvidenceTypes': {
            'view:hasVaMedicalRecords': true,
          },
          syncModern0781Flow: true,
          mentalHealthWorkflowChoice:
            form0781WorkflowChoices.COMPLETE_ONLINE_FORM, // Opt in/out
        }}
      />,
    );
    expect(container.querySelectorAll('va-radio').length).to.equal(1); // 0781 question VA radio button
  });

  it('should not render with 0781 questions when feature is enabled, and the user did opt out of 0781, and has new disabilites', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ...newClaimTypeOnly,
          newDisabilities,
          'view:selectableEvidenceTypes': {
            'view:hasVaMedicalRecords': true,
          },
          syncModern0781Flow: true,
          mentalHealthWorkflowChoice:
            form0781WorkflowChoices.OPT_OUT_OF_FORM0781, // Opt in/out
        }}
      />,
    );
    expect(container.querySelectorAll('va-radio').length).to.equal(0); // 0781 question VA radio button
  });

  it('should not render with 0781 questions when feature is disabled', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ...newClaimTypeOnly,
          newDisabilities,
          'view:selectableEvidenceTypes': {
            'view:hasVaMedicalRecords': true,
          },
          syncModern0781Flow: false,
        }}
      />,
    );
    expect(container.querySelectorAll('va-radio').length).to.equal(0); // 0781 question VA radio button
  });

  it('should not render with 0781 questions when it is a claim for increase only', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ...claimType,
          ratedDisabilities,
          'view:selectableEvidenceTypes': {
            'view:hasVaMedicalRecords': true,
          },
          syncModern0781Flow: false,
        }}
      />,
    );
    expect(container.querySelectorAll('va-radio').length).to.equal(0); // 0781 question VA radio button
  });

  describe('confirmation page traumatic event treatment display', () => {
    const confirmationField =
      uiSchema.providerFacility.items.treatmentLocation0781Related[
        'ui:confirmationField'
      ];

    it('displays "Yes" or "No" for traumatic event treatment responses', () => {
      const resultTrue = confirmationField({ formData: true });
      expect(resultTrue.data).to.equal('Yes');
      expect(resultTrue.label).to.equal(
        'Did you receive treatment at this facility related to the impact of any of your traumatic events?',
      );

      const resultFalse = confirmationField({ formData: false });
      expect(resultFalse.data).to.equal('No');
      expect(resultFalse.label).to.equal(
        'Did you receive treatment at this facility related to the impact of any of your traumatic events?',
      );
    });
  });
});

describe('VADS component validation tests', () => {
  // Shared test data factory
  const createProviderData = (overrides = {}) => ({
    initialData,
    providerFacility: [
      {
        providerFacilityName: 'Test Provider',
        treatmentDateRange: {
          from: '2020-01-01',
          to: '2020-12-31',
        },
        providerFacilityAddress: {
          country: 'USA',
          state: 'VA',
          city: 'TestCity',
          street: '123 Main St',
          postalCode: '12345',
        },
        ...overrides,
      },
    ],
  });

  // Helper to render form with data
  const renderForm = (data, props = {}) =>
    render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={data}
        uiSchema={uiSchema}
        {...props}
      />,
    );

  describe('postal code validation', () => {
    it('should show error for invalid postal code format (too short)', async () => {
      const data = createProviderData({
        providerFacilityAddress: {
          country: 'USA',
          state: 'VA',
          city: 'TestCity',
          street: '123 Main St',
          postalCode: '1234',
        },
      });
      const { container } = renderForm(data);

      const postalCodeInput = $(
        'va-text-input[name="root_providerFacility_0_providerFacilityAddress_postalCode"]',
        container,
      );

      fireEvent.blur(postalCodeInput);

      await waitFor(() => {
        expect(postalCodeInput.getAttribute('error')).to.exist;
      });
    });

    it('should accept valid 5-digit postal code', () => {
      const data = createProviderData();
      const { container } = renderForm(data);

      const postalCodeInput = $(
        'va-text-input[name="root_providerFacility_0_providerFacilityAddress_postalCode"]',
        container,
      );

      expect(postalCodeInput.getAttribute('value')).to.eq('12345');
      expect(postalCodeInput.getAttribute('error')).to.not.exist;
    });

    it('should accept valid 9-digit postal code with dash', () => {
      const data = createProviderData({
        providerFacilityAddress: {
          country: 'USA',
          state: 'VA',
          city: 'TestCity',
          street: '123 Main St',
          postalCode: '12345-6789',
        },
      });
      const { container } = renderForm(data);

      const postalCodeInput = $(
        'va-text-input[name="root_providerFacility_0_providerFacilityAddress_postalCode"]',
        container,
      );

      expect(postalCodeInput.getAttribute('value')).to.eq('12345-6789');
      expect(postalCodeInput.getAttribute('error')).to.not.exist;
    });
  });

  describe('street address maxLength validation', () => {
    it('should enforce 20 character limit on street address', async () => {
      const data = createProviderData({
        providerFacilityAddress: {
          country: 'USA',
          state: 'VA',
          city: 'TestCity',
          street: '123456789012345678901', // 21 characters
        },
      });
      const { container } = renderForm(data);

      const form = container.querySelector('form');
      fireEvent.submit(form);

      await waitFor(() => {
        const streetInput = $(
          'va-text-input[name="root_providerFacility_0_providerFacilityAddress_street"]',
          container,
        );
        expect(streetInput.getAttribute('error')).to.exist;
      });
    });

    it('should enforce 20 character limit on street address 2', async () => {
      const data = createProviderData({
        providerFacilityAddress: {
          country: 'USA',
          state: 'VA',
          city: 'TestCity',
          street: '123 Main St',
          street2: '123456789012345678901', // 21 characters
        },
      });
      const { container } = renderForm(data);

      const form = container.querySelector('form');
      fireEvent.submit(form);

      await waitFor(() => {
        const street2Input = $(
          'va-text-input[name="root_providerFacility_0_providerFacilityAddress_street2"]',
          container,
        );
        expect(street2Input.getAttribute('error')).to.exist;
      });
    });

    it('should accept street address at exactly 20 characters', () => {
      const data = createProviderData({
        providerFacilityAddress: {
          country: 'USA',
          state: 'VA',
          city: 'TestCity',
          street: '12345678901234567890', // Exactly 20 characters
        },
      });
      const { container } = renderForm(data);

      const streetInput = $(
        'va-text-input[name="root_providerFacility_0_providerFacilityAddress_street"]',
        container,
      );

      expect(streetInput.getAttribute('value')).to.eq('12345678901234567890');
    });
  });

  describe('city maxLength validation', () => {
    it('should enforce 30 character limit on city', async () => {
      const data = createProviderData({
        providerFacilityAddress: {
          country: 'USA',
          state: 'VA',
          city: '1234567890123456789012345678901', // 31 characters
          street: '123 Main St',
        },
      });
      const { container } = renderForm(data);

      const form = container.querySelector('form');
      fireEvent.submit(form);

      await waitFor(() => {
        const cityInput = $(
          'va-text-input[name="root_providerFacility_0_providerFacilityAddress_city"]',
          container,
        );
        expect(cityInput.getAttribute('error')).to.exist;
      });
    });

    it('should accept city at exactly 30 characters', () => {
      const data = createProviderData({
        providerFacilityAddress: {
          country: 'USA',
          state: 'VA',
          city: '123456789012345678901234567890', // Exactly 30 characters
          street: '123 Main St',
        },
      });
      const { container } = renderForm(data);

      const cityInput = $(
        'va-text-input[name="root_providerFacility_0_providerFacilityAddress_city"]',
        container,
      );

      expect(cityInput.getAttribute('value')).to.eq(
        '123456789012345678901234567890',
      );
    });
  });

  describe('date range validation', () => {
    it('should show error when end date is before start date', async () => {
      const onSubmit = sinon.spy();
      const data = createProviderData({
        treatmentDateRange: {
          from: '2020-12-31',
          to: '2020-01-01', // End date before start date
        },
      });
      const { container } = renderForm(data, { onSubmit });

      const form = container.querySelector('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(onSubmit.called).to.be.false;
        const toDate = $(
          'va-memorable-date[name="root_providerFacility_0_treatmentDateRange_to"]',
          container,
        );
        expect(toDate.getAttribute('error')).to.exist;
      });
    });

    it('should accept valid date range', () => {
      const data = createProviderData();
      const { container } = renderForm(data);

      const fromDate = $(
        'va-memorable-date[name="root_providerFacility_0_treatmentDateRange_from"]',
        container,
      );
      const toDate = $(
        'va-memorable-date[name="root_providerFacility_0_treatmentDateRange_to"]',
        container,
      );

      expect(fromDate.getAttribute('error')).to.not.exist;
      expect(toDate.getAttribute('error')).to.not.exist;
    });

    it('should reject future dates for treatment end date', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateStr = futureDate.toISOString().split('T')[0];

      const data = createProviderData({
        treatmentDateRange: {
          from: '2020-01-01',
          to: futureDateStr, // Future date
        },
      });
      const { container } = renderForm(data);

      const form = container.querySelector('form');
      fireEvent.submit(form);

      await waitFor(() => {
        const toDate = $(
          'va-memorable-date[name="root_providerFacility_0_treatmentDateRange_to"]',
          container,
        );
        expect(toDate.getAttribute('error')).to.exist;
      });
    });
  });

  describe('limited consent textarea interaction', () => {
    it('should show limited consent checkbox', () => {
      const { container } = renderForm({ initialData });

      const limitedConsentCheckbox = $(
        'va-checkbox[name="root_view:limitedConsent"]',
        container,
      );
      expect(limitedConsentCheckbox).to.exist;
    });

    it('should accept valid provider data without limited consent', () => {
      const onSubmit = sinon.spy();
      const data = createProviderData();
      const { container } = renderForm(data, { onSubmit });

      const form = container.querySelector('form');
      fireEvent.submit(form);

      expect(onSubmit.called).to.be.true;
    });

    it('should validate all required fields are present', () => {
      const { container } = renderForm({ initialData });

      expect(container.querySelectorAll('va-text-input').length).to.equal(6);
      expect(container.querySelectorAll('va-memorable-date').length).to.equal(
        2,
      );
      expect(container.querySelectorAll('va-select').length).to.equal(1);
      expect(container.querySelectorAll('va-checkbox').length).to.equal(1);
    });
  });
});
