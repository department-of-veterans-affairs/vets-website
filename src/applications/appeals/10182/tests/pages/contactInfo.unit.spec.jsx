import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';

import formConfig from '../../config/form';

describe('NOD contact information page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.infoPages.pages.confirmContactInfo;

  it('should render', () => {
    const form = shallow(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect(form.find('SchemaForm').length).to.equal(1);
    form.unmount();
  });
});
