import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import moment from 'moment';
import formConfig from '../../config/form';
import { form0781WorkflowChoices } from '../../content/form0781/workflowChoicePage';

describe('VA Medical Records', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.supportingEvidence.pages.vaMedicalRecords;
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
            'view:hasVaMedicalRecords': true,
          },
        }}
      />,
    );

    expect(form.find('input').length).to.equal(3); // non-checkbox inputs
    expect(form.find('va-checkbox').length).to.equal(3);
    expect(form.find('select').length).to.equal(3);
    form.unmount();
  });

  it('should render with rated disabilities and new conditions', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:claimType': {
            'view:claimingIncrease': true,
            'view:claimingNew': true,
          },
          newDisabilities,
          ratedDisabilities,
          'view:selectableEvidenceTypes': {
            'view:hasVaMedicalRecords': true,
          },
        }}
      />,
    );

    expect(form.find('input').length).to.equal(3); // non-checkbox inputs
    expect(form.find('va-checkbox').length).to.equal(4);
    expect(form.find('select').length).to.equal(3);
    form.unmount();
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
            'view:mentalHealthWorkflowChoice':
              form0781WorkflowChoices.COMPLETE_ONLINE_FORM, // Opt in/out
          }}
        />,
      );
      expect(form.find('va-radio').length).to.equal(1); // 0781 question VA radio button
      expect(form.find('input').length).to.equal(3); // non-checkbox inputs
      expect(form.find('va-checkbox').length).to.equal(1); // Disability checkboxes
      expect(form.find('select').length).to.equal(3);
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
            'view:mentalHealthWorkflowChoice':
              form0781WorkflowChoices.OPT_OUT_OF_FORM0781, // Opt in/out
          }}
        />,
      );
      expect(form.find('va-radio').length).to.equal(0); // 0781 question VA radio button
      expect(form.find('input').length).to.equal(3); // non-checkbox inputs
      expect(form.find('va-checkbox').length).to.equal(1); // Disability checkboxes
      expect(form.find('select').length).to.equal(3);
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
      expect(form.find('input').length).to.equal(3); // non-checkbox inputs
      expect(form.find('va-checkbox').length).to.equal(1); // Disability checkboxes
      expect(form.find('select').length).to.equal(3);
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
      expect(form.find('input').length).to.equal(3); // non-checkbox inputs
      expect(form.find('va-checkbox').length).to.equal(3); // Disability checkboxes
      expect(form.find('select').length).to.equal(3);
      form.unmount();
    });
  });

  // Ignore empty vaTreatmentFacilities when not selected, see
  // va.gov-team/issues/34289
  it('should allow submit if VA medical records not selected', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ...claimType,
          ratedDisabilities,
          'view:selectableEvidenceTypes': {
            'view:hasVaMedicalRecords': false,
          },
          vaTreatmentFacilities: [],
        }}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should not submit without all required info', () => {
    const onSubmit = sinon.spy();
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
          vaTreatmentFacilities: [],
        }}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    // Required field: Facility name
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(
      form.find(
        'va-checkbox-group[error="Please select at least one condition"]',
      ).length,
    ).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should not submit when treatment start date precedes service start date', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ...claimType,
          ratedDisabilities,
          vaTreatmentFacilities: [
            {
              treatmentCenterName: 'Sommerset VA Clinic',
              treatedDisabilityNames: {
                diabetesmelitus: true,
              },
              treatmentDateRange: {
                from: '2001-05-XX',
              },
              treatmentCenterAddress: {
                country: 'USA',
                city: 'Sommerset',
                state: 'VA',
              },
            },
          ],
          serviceInformation: {
            servicePeriods: [
              { dateRange: { from: '2012-01-12' } },
              { dateRange: { from: '2001-06-30' } },
            ],
          },
        }}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit when treatment start date equals service start date', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ...claimType,
          ratedDisabilities,
          vaTreatmentFacilities: [
            {
              treatmentCenterName: 'Sommerset VA Clinic',
              treatedDisabilityNames: {
                diabetesmelitus: true,
              },
              treatmentDateRange: {
                from: '2001-05-XX',
              },
              treatmentCenterAddress: {
                country: 'USA',
                city: 'Sommerset',
                state: 'VA',
              },
            },
          ],
          serviceInformation: {
            servicePeriods: [
              { dateRange: { from: '2012-01-12' }, serviceBranch: 'Army' },
              { dateRange: { from: '2001-05-30' }, serviceBranch: 'Army' },
            ],
          },
        }}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.calledOnce).to.be.true;
    form.unmount();
  });

  it('should submit when treatment start date year without month equals earliest service start date year', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ...claimType,
          ratedDisabilities,
          vaTreatmentFacilities: [
            {
              treatmentCenterName: 'Sommerset VA Clinic',
              treatedDisabilityNames: {
                diabetesmelitus: true,
              },
              treatmentDateRange: {
                from: '2001-XX-XX',
              },
              treatmentCenterAddress: {
                country: 'USA',
                city: 'Sommerset',
                state: 'VA',
              },
            },
          ],
          serviceInformation: {
            servicePeriods: [
              { dateRange: { from: '2012-01-12' }, serviceBranch: 'Army' },
              { dateRange: { from: '2001-05-30' }, serviceBranch: 'Army' },
            ],
          },
        }}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.calledOnce).to.be.true;
    form.unmount();
  });

  it('should not submit when treatment start date includes a month but no year', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ...claimType,
          ratedDisabilities,
          vaTreatmentFacilities: [
            {
              treatmentCenterName: 'Sommerset VA Clinic',
              treatedDisabilityNames: {
                diabetesmelitus: true,
              },
              treatmentDateRange: {
                from: 'XXXX-05-XX',
              },
              treatmentCenterAddress: {
                country: 'USA',
                city: 'Sommerset',
                state: 'VA',
              },
            },
          ],
          serviceInformation: {
            servicePeriods: [
              { dateRange: { from: '2012-01-12' } },
              { dateRange: { from: '2001-06-30' } },
            ],
          },
        }}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should not submit when treatment start date is in the future', () => {
    const onSubmit = sinon.spy();
    const futureDate = `${moment()
      .add(1, 'month')
      .format('YYYY-MM')}-XX`;
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ...claimType,
          ratedDisabilities,
          vaTreatmentFacilities: [
            {
              treatmentCenterName: 'Sommerset VA Clinic',
              treatedDisabilityNames: {
                diabetesmelitus: true,
              },
              treatmentDateRange: {
                from: futureDate,
              },
              treatmentCenterAddress: {
                country: 'USA',
                city: 'Sommerset',
                state: 'VA',
              },
            },
          ],
          serviceInformation: {
            servicePeriods: [
              { dateRange: { from: '2012-01-12' } },
              { dateRange: { from: '2001-06-30' } },
            ],
          },
        }}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit with all required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ...claimType,
          ratedDisabilities,
          vaTreatmentFacilities: [
            {
              treatmentCenterName: 'Test clinic',
              treatedDisabilityNames: {
                diabetesmelitus: true,
              },
              treatmentDateRange: {
                from: '2010-04-XX',
              },
              treatmentCenterAddress: {
                country: 'USA',
                city: 'Sommerset',
                state: 'VA',
              },
            },
          ],
        }}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.calledOnce).to.be.true;
    form.unmount();
  });

  it('should require military city when military state selected', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ...claimType,
          ratedDisabilities,
          vaTreatmentFacilities: [
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
                city: 'Sommerset',
                state: 'AA',
              },
            },
          ],
        }}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should require military state when military city entered', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ...claimType,
          ratedDisabilities,
          vaTreatmentFacilities: [
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
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
});
