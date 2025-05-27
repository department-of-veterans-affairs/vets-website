import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import { DefinitionTester } from '~/platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.institutionDetailsChapter.pages.institutionDetailsFacility;
const { defaultDefinitions: definitions } = formConfig;

const mockStore = configureStore([]);

describe('22-8894 - Institution Details Facility', () => {
  const storeWithCode = mockStore({
    form: {
      data: {
        institutionDetails: { hasVaFacilityCode: true },
      },
    },
  });

  it('renders the correct amount of inputs', () => {
    const form = mount(
      <Provider store={storeWithCode}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          definitions={definitions}
        />
      </Provider>,
    );

    expect(form.find('va-text-input').length).to.equal(1);
    expect(form.find('InstitutionName').length).to.equal(1);
    expect(form.find('InstitutionAddress').length).to.equal(1);

    form.unmount();
  });

  it('should show errors when required field is empty', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={storeWithCode}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          definitions={definitions}
          onSubmit={onSubmit}
          data={{ institutionDetails: { hasVaFacilityCode: true } }}
        />
      </Provider>,
    );

    form.find('form').simulate('submit');

    // facilityCode is required
    expect(form.find('va-text-input[error]').length).to.equal(1);
    expect(onSubmit.called).to.be.false;

    form.unmount();
  });

  it('should validate facility code length', () => {
    const errors = {
      messages: [],
      addError(msg) {
        this.messages.push(msg);
      },
    };
    const validate =
      uiSchema.institutionDetails.facilityCode['ui:validations'][0];

    validate(errors, '1234567');
    expect(errors.messages).to.include(
      'Please enter a valid 8-character facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
    );

    errors.messages = [];
    validate(errors, '12345678');
    expect(errors.messages).to.be.empty;
  });

  it("blocks submission when institutionName is 'not found'", () => {
    const onSubmit = sinon.spy();
    const data = {
      institutionDetails: {
        hasVaFacilityCode: true,
        facilityCode: '12345678',
        institutionName: 'not found',
      },
    };
    const form = mount(
      <Provider store={storeWithCode}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          definitions={definitions}
          data={data}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    form.find('form').simulate('submit');
    expect(form.find('va-text-input[error]').length).to.equal(1);
    expect(onSubmit.called).to.be.false;

    form.unmount();
  });
});
