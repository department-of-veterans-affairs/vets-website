import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
  fillDate,
} from 'platform/testing/unit/schemaform-utils';
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

  // TODO: fix this test, it's not working because of the select fields
  it('should add a provider facility', async () => {
    const onSubmit = sinon.spy();

    const form = mount(
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
          providerFacility: [
            {
              treatmentCenterName: 'Sommerset VA Clinic',
              treatedDisabilityNames: {
                diabetesmelitus: true,
              },
              treatmentDateRange: {
                from: '2010-04-XX',
              },
              treatmentCenterAddress: {
                country: 'USA',
                city: 'APO',
                state: 'VA',
              },
            },
          ],
        }}
        uiSchema={uiSchema}
      />,
    );

    //  All fields filled
    fillData(
      form,
      'input#root_providerFacility_0_providerFacilityName',
      'Local facility',
    );
    fillDate(
      form,
      'root_providerFacility_0_treatmentDateRange_from',
      '1950-1-3',
    );
    fillDate(form, 'root_providerFacility_0_treatmentDateRange_to', '1951-1-3');
    // TODO: this may not be needed since it defaults to USA
    fillData(
      form,
      'va-select[name="root_providerFacility_0_providerFacilityAddress_country"]',
      'USA',
    );
    fillData(
      form,
      'input#root_providerFacility_0_providerFacilityAddress_street',
      '101 Street',
    );

    // TODO: Selection is kind of weird, we have shadowroots to navigate
    fillData(
      form,
      'va-select[name="root_providerFacility_0_providerFacilityAddress_state"]',
      'AK',
    );
    fillData(
      form,
      'input#root_providerFacility_0_providerFacilityAddress_city',
      'Anyville',
    );
    fillData(
      form,
      'input#root_providerFacility_0_providerFacilityAddress_postalCode',
      '29414',
    );

    await waitFor(() => {
      expect(form.find('.usa-input-error').length).to.equal(0);

      // va-select element has error attribute when there is an error
      const countrySelector =
        'va-select[name="root_providerFacility_0_providerFacilityAddress_country"]';
      expect(form.find(countrySelector).prop('error')).to.not.exist;

      const stateSelector =
        'va-select[name="root_providerFacility_0_providerFacilityAddress_state"]';
      expect(form.find(stateSelector).prop('error')).to.not.exist;

      // TODO: this was at the top of the waitFor, but it was just throwing a failed to submit error
      //  and not highlighting exactly what was wrong. We can move it back up after we get the select fixed
      form.find('form').simulate('submit');
      expect(onSubmit.called).to.be.true;
    });
    form.unmount();
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
});
