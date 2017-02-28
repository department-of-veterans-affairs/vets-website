import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-addons-test-utils';
import Form from 'react-jsonschema-form';

import { DefinitionTester } from '../../../util/schemaform-utils.jsx';
import formConfig from '../../../../src/js/edu-benefits/1995/config/form';

describe('Edu 1995 schoolSelection', () => {
  const { schema, uiSchema } = formConfig.chapters.schoolSelection.pages.newSchool;

  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );

    expect(ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'input'))
      .to.not.be.empty;
  });

  it('should require school only name and education type', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          formData={{}}
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);

    // Submit the form with no information
    ReactTestUtils.findRenderedComponentWithType(form, Form).onSubmit({
      preventDefault: f => f
    });

    // Expect these fields to require validation
    expect(formDOM.querySelector('.usa-input-error #root_newSchoolName')).to.not.be.null;
    expect(formDOM.querySelector('.usa-input-error #root_educationType')).to.not.be.null;

    // There should only be the two errors
    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(2);
  });

  // Should also have a test that checks that the Address fields are shown when
  //  you pick the right education type.
  it('should show address conditionally', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
          formData={{}}
          schema={schema}
          data={{}}
          uiSchema={uiSchema}/>
    );

    const formDOM = findDOMNode(form);
    const find = formDOM.querySelector.bind(formDOM);

    // Look for the address; shouldn't be there
    expect(formDOM.querySelector('#root_newSchoolAddress_country')).to.be.null;

    // Change the education type
    ReactTestUtils.Simulate.change(find('#root_educationType'), {
      target: {
        value: 'college'
      }
    });

    // Look for the address again; should be there
    expect(formDOM.querySelector('#root_newSchoolAddress_country')).to.not.be.null;
  });
});
