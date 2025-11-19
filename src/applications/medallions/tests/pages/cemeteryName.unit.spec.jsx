import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('Medallions cemeteryName', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.burialInformation.pages.cemeteryName;

  it('should render the cemetery name input', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('va-text-input').length).to.equal(1);
    form.unmount();
  });
});
