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

    const cards = tree.find('.review-card');
    expect(cards.length).to.equal(2);

    // Checking props, need to target nested rendered component?
    const { formData } = tree.props();
    const { phoneEmailCard, mailingAddress } = initialData;
    expect(formData.phoneEmailCard).to.deep.equal({
      primaryPhone: phoneEmailCard.primaryPhone,
      phone: phoneEmailCard.phone,
      emailAddress: phoneEmailCard.emailAddress,
    });

    expect(formData.mailingAddress).to.deep.equal({
      addressLine1: mailingAddress.addressLine1,
      city: mailingAddress.city,
      countryCodeIso3: mailingAddress.countryCodeIso3,
      state: mailingAddress.state,
      zipCode: mailingAddress.zipCode,
    });

    tree.unmount();
  });
});
