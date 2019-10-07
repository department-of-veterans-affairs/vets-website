import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';
import initialData from '../schema/initialData';

import { schema, uiSchema } from '../../pages/contactInfo';

describe('Contact Information', () => {
  it('should render Veteran phone number, email & address', () => {
    const tree = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={initialData}
        formData={initialData}
      />,
    );

    const phoneNumber = tree.find('.review-card');
    // console.log(phoneNumber.first().text());
    expect(phoneNumber.length).to.equal(2);

    tree.unmount();
  });
});
