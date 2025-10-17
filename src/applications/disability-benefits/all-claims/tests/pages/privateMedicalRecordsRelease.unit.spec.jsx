import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { fireEvent, render } from '@testing-library/react';
// import { $ } from '@department-of-veterans-affairs/platform-testing/helpers'; // did not use this import
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui'; // import from the ui itself

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { waitFor } from '@testing-library/dom';
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
  it('should render 4142 form', async () => {
    const form = mount(
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

    expect(form);
    expect(form.find('input').length).to.equal(7); // non-checkbox inputs
    expect(form.find('va-checkbox').length).to.equal(1);
    // treatmentDateRange has 2 select inputs for each date (month, day)
    expect(form.find('select').length).to.equal(4);
    // providerFacilityAddress country and state are web-component-pattern's
    expect(form.find('va-select').length).to.equal(2);
    form.unmount();
  });

  it('should add a provider facility', async () => {
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
    expect(
      $(
        'input#root_providerFacility_0_providerFacilityName',
        container,
      ).getAttribute('value'),
    ).to.eq(facilityProvider.providerFacilityName);
    expect(
      $(
        'select#root_providerFacility_0_treatmentDateRange_fromMonth',
        container,
      ).value,
    ).to.eq('1');
    expect(
      $('select#root_providerFacility_0_treatmentDateRange_fromDay', container)
        .value,
    ).to.eq('3');
    expect(
      $(
        'input#root_providerFacility_0_treatmentDateRange_fromYear',
        container,
      ).getAttribute('value'),
    ).to.eq('1950');
    expect(
      $('select#root_providerFacility_0_treatmentDateRange_toMonth', container)
        .value,
    ).to.eq('12');
    expect(
      $('select#root_providerFacility_0_treatmentDateRange_toDay', container)
        .value,
    ).to.eq('31');
    expect(
      $(
        'input#root_providerFacility_0_treatmentDateRange_toYear',
        container,
      ).getAttribute('value'),
    ).to.eq('1950');
    expect(
      $('va-select[label="Country"]', container).getAttribute('value'),
    ).to.eq(facilityProvider.providerFacilityAddress.country);
    expect(
      $('va-select[label="State"]', container).getAttribute('value'),
    ).to.eq(facilityProvider.providerFacilityAddress.state);
    expect(
      $(
        'input#root_providerFacility_0_providerFacilityAddress_street',
        container,
      ).getAttribute('value'),
    ).to.eq(facilityProvider.providerFacilityAddress.street);
    expect(
      $(
        'input#root_providerFacility_0_providerFacilityAddress_city',
        container,
      ).getAttribute('value'),
    ).to.eq(facilityProvider.providerFacilityAddress.city);
    expect(
      $(
        'input#root_providerFacility_0_providerFacilityAddress_postalCode',
        container,
      ).getAttribute('value'),
    ).to.eq(facilityProvider.providerFacilityAddress.postalCode);

    // Check that there are no validation errors
    expect(container.querySelectorAll('.usa-input-error').length).to.equal(0);
    // Check that there are 2 va-select elements -> the new elements that is used in this pr
    expect(container.querySelectorAll('va-select').length).to.equal(2);

    // the following commented lines originate from the Enzyme style unit tests, which is also still referenced in the other , prior to the introduction of VADS components. they've been included here as a point of reference for how Enzyme tests confirmed the absence of errors countrySelector and stateSelector are
    // // va-select element has error attribute when there is an error
    // const countrySelector =
    //   'va-select[name="root_providerFacility_0_providerFacilityAddress_country"]';
    // expect(form.find(countrySelector).prop('error')).to.not.exist;

    // const stateSelector =
    //   'va-select[name="root_providerFacility_0_providerFacilityAddress_state"]';
    // expect(form.find(stateSelector).prop('error')).to.not.exist;

    // Simulate form submission using RTL
    const form = container.querySelector('form');
    if (form) {
      fireEvent.submit(form);
    }
    expect(onSubmit.called).to.be.true;
  });

  it('does not submit (and renders error messages) when no fields touched', async () => {
    const submit = sinon.spy();

    const form = mount(
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

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(submit.called).to.be.false;

      expect(form.find('.usa-input-error').length).to.equal(6);

      // va-select element has error attribute when there is an error
      const stateSelector =
        'va-select[name="root_providerFacility_0_providerFacilityAddress_state"]';
      expect(form.find(stateSelector).prop('error')).to.equal(
        'You must provide a response',
      );

      // treatmentDateRange has 2 select inputs for each date (month, day)
      expect(form.find('select').length).to.equal(4);
      // providerFacilityAddress country and state are web-component-pattern's
      expect(form.find('va-select').length).to.equal(2);

      expect(form.find('input').length).to.equal(7); // non-checkbox inputs
      expect(form.find('va-checkbox').length).to.equal(1);
    });
    form.unmount();
  });

  it('does not submit (and renders error messages) when limited consent option chosen and no fields touched', async () => {
    const submit = sinon.spy();

    const form = mount(
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

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(submit.called).to.be.false;

      expect(form.find('.usa-input-error').length).to.equal(7);

      // va-select element has error attribute when there is an error
      const stateSelector =
        'va-select[name="root_providerFacility_0_providerFacilityAddress_state"]';
      expect(form.find(stateSelector).prop('error')).to.equal(
        'You must provide a response',
      );

      expect(form.find('input').length).to.equal(8); // non-checkbox inputs
      expect(form.find('va-checkbox').length).to.equal(1);
    });
    form.unmount();
  });

  it('should render with rated disabilities', () => {
    const form = mount(
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

    // treatmentDateRange has 2 select inputs for each date (month, day)
    expect(form.find('select').length).to.equal(4);
    // providerFacilityAddress country and state are web-component-pattern's
    expect(form.find('va-select').length).to.equal(2);

    expect(form.find('va-checkbox').length).to.equal(4);
    form.unmount();
  });
});

describe('updated 4142 provider medical records release', () => {
  it('should render the treated disability checkboxes section when disability526Enable2024Form4142 is true', () => {
    const form = mount(
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
    expect(form.find('va-checkbox').length).to.equal(4);
    form.unmount();
  });
  it('should not render the treated disability checkboxes section when disability526Enable2024Form4142 is false', () => {
    const form = mount(
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
    expect(form.find('va-checkbox').length).to.equal(1);
    form.unmount();
  });
});

describe('0781 question', () => {
  it('should render with 0781 questions when feature is enabled, user opted into 0781, and has new disabilites', () => {
    const form = mount(
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
    expect(form.find('va-radio').length).to.equal(1); // 0781 question VA radio button
    form.unmount();
  });

  it('should not render with 0781 questions when feature is enabled, and the user did opt out of 0781, and has new disabilites', () => {
    const form = mount(
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
    expect(form.find('va-radio').length).to.equal(0); // 0781 question VA radio button
    form.unmount();
  });

  it('should not render with 0781 questions when feature is disabled', () => {
    const form = mount(
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
    expect(form.find('va-radio').length).to.equal(0); // 0781 question VA radio button
    form.unmount();
  });

  it('should not render with 0781 questions when it is a claim for increase only', () => {
    const form = mount(
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
    expect(form.find('va-radio').length).to.equal(0); // 0781 question VA radio button
    form.unmount();
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
