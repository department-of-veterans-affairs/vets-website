import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('Medallions cemeteryContactInfo', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.burialInformation.pages.cemeteryContactInfo;

  it('should render the cemetery contact info inputs', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('va-text-input').length).to.equal(3); // first, last, email
    form.unmount();
  });
});
