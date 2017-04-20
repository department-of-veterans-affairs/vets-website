import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-addons-test-utils';

import { DefinitionTester } from '../../util/schemaform-utils.jsx';
import formConfig from '../../../src/js/hca-rjsf/config/form.js';

describe('HCA veteranInformation', () => {
  it('should render veteranInformation page', () => {
    const { schema, uiSchema } = formConfig.chapters.veteranInformation.pages.veteranInformation;
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(5);
    expect(formDOM.querySelector('#root_veteranFullName_first')).not.to.be.null;
  });

  it('should render birthInformation page', () => {
    const { schema, uiSchema } = formConfig.chapters.veteranInformation.pages.birthInformation;
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(6);
    expect(formDOM.querySelector('#root_veteranSocialSecurityNumber')).not.to.be.null;
  });
});
