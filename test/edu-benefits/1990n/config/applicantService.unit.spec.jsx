import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-addons-test-utils';

import { DefinitionTester } from '../../../util/schemaform-utils.jsx';
import formConfig from '../../../../src/js/edu-benefits/1990n/config/form';

describe('Edu 1990n applicantService', () => {
  const { schema, uiSchema } = formConfig.chapters.applicantInformation.pages.applicantService;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const fields = Array.from(findDOMNode(form).querySelectorAll('input, select'));

    expect(fields.length).to.equal(2);
  });

  it('should expand tours and other questions', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );
    const formDOM = findDOMNode(form);

    const applicantServedYes = Array.from(formDOM.querySelectorAll('input'))
      .find(input => input.id.startsWith('root_view:applicantServedYes'));

    ReactTestUtils.Simulate.change(applicantServedYes, {
      target: {
        checked: true
      }
    });

    let fields = Array.from(findDOMNode(form).querySelectorAll('input, select'));
    expect(fields.length).to.equal(11);

    const currentlyActiveDuty = formDOM.querySelector('#root_currentlyActiveDuty_yesYes');
    ReactTestUtils.Simulate.change(currentlyActiveDuty, {
      target: {
        checked: true
      }
    });

    fields = Array.from(findDOMNode(form).querySelectorAll('input, select'));

    expect(fields.length).to.equal(15);
  });
});
