import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';

import formConfig from '../../../0994/config/form.js';

describe('Applicant information page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.applicantInformation;

  it('renders the applicant information page', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(7);
    expect(form.find('select').length).to.equal(3);

    form.unmount();
  });
});
