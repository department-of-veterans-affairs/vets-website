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

  it('should render ', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ratedDisabilities: [
            {
              name: 'Post traumatic stress disorder',
              'view:selected': true,
            },
            {
              name: 'Intervertebral disc syndrome',
              'view:selected': true,
            },
          ],
        }}
      />,
    );

    expect(form.find('input').length).to.equal(6);
    expect(form.find('select').length).to.equal(4);
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
          ratedDisabilities: [
            {
              name: 'Post traumatic stress disorder',
              'view:selected': true,
            },
            {
              name: 'Intervertebral disc syndrome',
              'view:selected': true,
            },
          ],
          vaTreatmentFacilities: [],
        }}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    // Required fields: Facility name, related disability, and treatment start date
    expect(form.find('.usa-input-error-message').length).to.equal(3);
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
          ratedDisabilities: [
            {
              name: 'Post traumatic stress disorder',
              'view:selected': true,
            },
            {
              name: 'Intervertebral disc syndrome',
              'view:selected': true,
            },
          ],
          vaTreatmentFacilities: [
            {
              treatmentCenterName: 'Sommerset VA Clinic',
              treatedDisabilityNames: {
                'Diabetes Melitus': true,
              },
              treatmentDateRange: {
                from: '2001-05-XX',
                to: '2015-09-XX',
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
          ratedDisabilities: [
            {
              name: 'Post traumatic stress disorder',
              'view:selected': true,
            },
            {
              name: 'Intervertebral disc syndrome',
              'view:selected': true,
            },
          ],
          vaTreatmentFacilities: [
            {
              treatmentCenterName: 'Sommerset VA Clinic',
              treatedDisabilityNames: {
                'Diabetes Melitus': true,
              },
              treatmentDateRange: {
                from: '2001-05-XX',
                to: '2015-09-XX',
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
              { dateRange: { from: '2001-05-30' } },
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
          ratedDisabilities: [
            {
              name: 'Post traumatic stress disorder',
              'view:selected': true,
            },
            {
              name: 'Intervertebral disc syndrome',
              'view:selected': true,
            },
          ],
          vaTreatmentFacilities: [
            {
              treatmentCenterName: 'Sommerset VA Clinic',
              treatedDisabilityNames: {
                'Diabetes Melitus': true,
              },
              treatmentDateRange: {
                from: '2010-04-XX',
                to: '2015-09-XX',
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
          ratedDisabilities: [
            {
              name: 'Post traumatic stress disorder',
              'view:selected': true,
            },
            {
              name: 'Intervertebral disc syndrome',
              'view:selected': true,
            },
          ],
          vaTreatmentFacilities: [
            {
              treatmentCenterName: 'Sommerset VA Clinic',
              treatedDisabilityNames: {
                'Diabetes Melitus': true,
              },
              treatmentDateRange: {
                from: '2010-04-XX',
                to: '2015-09-XX',
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
          ratedDisabilities: [
            {
              name: 'Post traumatic stress disorder',
              'view:selected': true,
            },
            {
              name: 'Intervertebral disc syndrome',
              'view:selected': true,
            },
          ],
          vaTreatmentFacilities: [
            {
              treatmentCenterName: 'Sommerset VA Clinic',
              treatedDisabilityNames: {
                'Diabetes Melitus': true,
              },
              treatmentDateRange: {
                from: '2010-04-XX',
                to: '2015-09-XX',
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
