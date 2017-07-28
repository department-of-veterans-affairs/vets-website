import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester, getFormDOM } from '../../util/schemaform-utils.jsx';
import formConfig from '../../../src/js/pensions/config/form';

const definitions = formConfig.defaultDefinitions;

describe('Pensions benefitsSelection', () => {
  const { schema, uiSchema } = formConfig.chapters.benefitsSelection.pages.benefitsSelection;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          definitions={definitions}
          uiSchema={uiSchema}/>
    );

    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input,select').length).to.equal(2);
  });
  it('should render warning on Yes', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          definitions={definitions}
          uiSchema={uiSchema}/>
    );

    const formDOM = getFormDOM(form);
    formDOM.fillData('#root_view\\:aidAttendanceYes', 'Y');
    expect(formDOM.querySelector('.usa-alert-info')).not.to.be.null;
  });
  it('should submit', () => {
    const onSubmit = sinon.spy();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          definitions={definitions}
          onSubmit={onSubmit}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = getFormDOM(form);

    formDOM.submitForm();
    expect(onSubmit.called).to.be.true;
  });
});
