import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('Pre-need sponsor military history', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.militaryHistory.pages.sponsorMilitaryHistory;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(4);
    expect(form.find('select').length).to.equal(5);
    form.unmount();
  });
});
