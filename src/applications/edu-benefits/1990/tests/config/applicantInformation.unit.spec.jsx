import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import moment from 'moment';

import {
  getFormDOM,
  DefinitionTester,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';

describe('Edu 1990 Applicant Information', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.applicantInformation.pages.applicantInformation;

  it('should render', () => {
    const screen = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    expect(screen.queryAllByRole('combobox').length).to.equal(3);
    expect(screen.queryAllByRole('textbox').length).to.equal(4);
    expect(screen.queryAllByRole('radio').length).to.equal(2);
  });

  it('should not submit form without information', () => {
    const screen = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = getFormDOM(screen);
    formDOM.submitForm();

    expect(formDOM.querySelectorAll('.usa-input-error').length).to.equal(4);
  });

  it('should only allow ages >= 17 years', () => {
    const screen = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );
    const formDOM = getFormDOM(screen);

    // 17th birthday is tomorrow
    const dob = moment()
      .subtract(17, 'years')
      .add(1, 'day');
    formDOM.fillDate('root_veteranDateOfBirth', dob.format('YYYY-MM-DD'));
    formDOM.submitForm();
    expect(
      formDOM.querySelectorAll('.usa-input-error #root_veteranDateOfBirthMonth')
        .length,
    ).to.equal(1);

    // 17th birthday is today
    // Happy birthday!
    formDOM.fillDate(
      'root_veteranDateOfBirth',
      dob.subtract(1, 'day').format('YYYY-MM-DD'),
    );
    formDOM.submitForm();
    expect(
      formDOM.querySelectorAll('.usa-input-error #root_veteranDateOfBirthMonth')
        .length,
    ).to.equal(0);
  });
});
