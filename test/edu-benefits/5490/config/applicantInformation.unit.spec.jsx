import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-addons-test-utils';

import { DefinitionTester } from '../../../util/schemaform-utils.jsx';
import formConfig from '../../../../src/js/edu-benefits/5490/config/form.js';

describe('Edu 5490 applicantInformation', () => {
  const { schema, uiSchema } = formConfig.chapters.applicantInformation.pages.applicantInformation;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);

    expect(formDOM.querySelectorAll('input, select').length).to.equal(13);
  });
});
