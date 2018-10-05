import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester } from '../../../../../platform/testing/unit/schemaform-utils.jsx';
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
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(6);
    expect(form.find('select').length).to.equal(6);
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
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(6);
    expect(onSubmit.called).to.be.false;
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
              relatedDisabilities: {
                'Diabetes Melitus': true,
              },
              treatmentDateRange: {
                from: '2010-04-05',
                to: '2015-09-09',
              },
              treatmentCenterAddress: {
                country: 'USA',
                city: 'Sommerset',
                state: 'VA',
              },
            },
          ],
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.calledOnce).to.be.true;
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
              relatedDisabilities: {
                'Diabetes Melitus': true,
              },
              treatmentDateRange: {
                from: '2010-04-05',
                to: '2015-09-09',
              },
              treatmentCenterAddress: {
                country: 'USA',
                city: 'Sommerset',
                state: 'AA',
              },
            },
          ],
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
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
              relatedDisabilities: {
                'Diabetes Melitus': true,
              },
              treatmentDateRange: {
                from: '2010-04-05',
                to: '2015-09-09',
              },
              treatmentCenterAddress: {
                country: 'USA',
                city: 'APO',
                state: 'VA',
              },
            },
          ],
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should not require state when country is not USA', () => {
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
              relatedDisabilities: {
                'Diabetes Melitus': true,
              },
              treatmentDateRange: {
                from: '2010-04-05',
                to: '2015-09-09',
              },
              treatmentCenterAddress: {
                country: 'Ukraine',
                city: 'Kiev',
              },
            },
          ],
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should require state when country is USA', () => {
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
              relatedDisabilities: {
                'Diabetes Melitus': true,
              },
              treatmentDateRange: {
                from: '2010-04-05',
                to: '2015-09-09',
              },
              treatmentCenterAddress: {
                country: 'USA',
                city: 'Sommerset',
              },
            },
          ],
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });
});
