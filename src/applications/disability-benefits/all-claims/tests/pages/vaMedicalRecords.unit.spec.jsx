import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

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
          'view:hasEvidenceFollowUp': {
            'view:selectableEvidenceTypes': {
              'view:hasVaMedicalRecords': true,
            },
          },
        }}
      />,
    );

    expect(form.find('input').length).to.equal(6);
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
          'view:hasEvidenceFollowUp': {
            'view:selectableEvidenceTypes': {
              'view:hasVaMedicalRecords': true,
            },
          },
        }}
      />,
    );

    expect(form.find('input').length).to.equal(7);
    expect(form.find('select').length).to.equal(3);
    form.unmount();
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
          'view:hasEvidenceFollowUp': {
            'view:selectableEvidenceTypes': {
              'view:hasVaMedicalRecords': false,
            },
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
          'view:hasEvidenceFollowUp': {
            'view:selectableEvidenceTypes': {
              'view:hasVaMedicalRecords': true,
            },
          },
          vaTreatmentFacilities: [],
        }}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    // Required fields: Facility name and related disability
    expect(form.find('.usa-input-error-message').length).to.equal(2);
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
