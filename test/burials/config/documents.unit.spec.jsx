import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester, getFormDOM } from '../../util/schemaform-utils.jsx';
import formConfig from '../../../src/js/burials/config/form';

describe('Burials document upload', () => {
  const { schema, uiSchema, depends } = formConfig.chapters.additionalInformation.pages.documentUpload;

  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input,select').length).to.equal(0);
  });

  it('should render death certificate field', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{
            burialAllowanceRequested: 'service'
          }}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input,select').length).to.equal(1);
  });

  it('should render receipts field', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{
            'view:claimedBenefits': {
              transportation: true
            }
          }}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input,select').length).to.equal(1);
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{
            burialAllowanceRequested: 'service',
            'view:claimedBenefits': {
              transportation: true
            }
          }}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
    );

    const formDOM = getFormDOM(form);

    formDOM.submitForm();

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(2);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit with valid data', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{
            burialAllowanceRequested: 'service',
            'view:claimedBenefits': {
              transportation: true
            },
            deathCertificate: [{
              confirmationCode: 'testing'
            }],
            transportationReceipts: [{
              confirmationCode: 'testing'
            }, {
              confirmationCode: 'testing2'
            }]
          }}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
    );

    const formDOM = getFormDOM(form);

    formDOM.submitForm();
    expect(onSubmit.called).to.be.true;
  });

  it('depends should not be true without transportation or service connected death', () => {
    const result = depends({});

    expect(result).to.be.false;
  });

  it('depends should be true with transportation', () => {
    const result = depends({
      'view:claimedBenefits': {
        transportation: true
      }
    });

    expect(result).to.be.true;
  });

  it('depends should be true with service connected death', () => {
    const result = depends({
      burialAllowanceRequested: 'service'
    });

    expect(result).to.be.true;
  });
});
