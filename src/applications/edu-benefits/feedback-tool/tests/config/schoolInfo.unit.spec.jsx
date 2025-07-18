import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { render, waitFor } from '@testing-library/react';
import _ from 'lodash';
import {
  DefinitionTester,
  fillData,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('feedback tool school info', () => {
  let sandbox;
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.schoolInformation.pages.schoolInformation;
  _.unset(uiSchema, 'educationDetails.school.view:searchSchoolSelect');

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{
          educationDetails: {
            school: {
              'view:searchSchoolSelect': {
                'view:manualSchoolEntryChecked': true,
              },
              'view:manualSchoolEntry': {
                address: {
                  country: 'United States',
                },
              },
            },
          },
        }}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input').length).to.equal(7);
    form.unmount();
  });

  it('should render international address fields', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{
          educationDetails: {
            school: {
              'view:searchSchoolSelect': {
                'view:manualSchoolEntryChecked': true,
              },
            },
          },
        }}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input').length).to.equal(8);
    form.unmount();
  });

  it('should not submit without required information', async () => {
    const onSubmit = sandbox.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        data={{
          educationDetails: {
            school: {
              'view:searchSchoolSelect': {
                'view:manualSchoolEntryChecked': true,
              },
              'view:manualSchoolEntry': {
                address: {
                  country: 'United States',
                },
              },
            },
          },
        }}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM({ container });
    formDOM.submitForm();

    await waitFor(() => {
      expect(container.querySelectorAll('.usa-input-error').length).to.equal(5);
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should not submit without required international address information', async () => {
    const onSubmit = sandbox.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        data={{
          educationDetails: {
            school: {
              'view:searchSchoolSelect': {
                'view:manualSchoolEntryChecked': true,
              },
            },
          },
        }}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM({ container });
    formDOM.submitForm();

    await waitFor(() => {
      expect(container.querySelectorAll('.usa-input-error').length).to.equal(3);
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should submit with required information', () => {
    const onSubmit = sandbox.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{
          educationDetails: {
            school: {
              'view:searchSchoolSelect': {
                'view:manualSchoolEntryChecked': true,
              },
              'view:manualSchoolEntry': {
                address: {
                  country: 'United States',
                },
              },
            },
          },
        }}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    fillData(
      form,
      'input[name="root_educationDetails_school_view:manualSchoolEntry_name"]',
      'test',
    );
    fillData(
      form,
      'input[name="root_educationDetails_school_view:manualSchoolEntry_address_street"]',
      'test',
    );
    fillData(
      form,
      'input[name="root_educationDetails_school_view:manualSchoolEntry_address_city"]',
      'test',
    );
    fillData(
      form,
      'input[name="root_educationDetails_school_view:manualSchoolEntry_address_postalCode"]',
      '34343',
    );
    fillData(
      form,
      'select[name="root_educationDetails_school_view:manualSchoolEntry_address_state"]',
      'MA',
    );
    fillData(
      form,
      'select[name="root_educationDetails_school_view:manualSchoolEntry_address_country"]',
      'United States',
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
