import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

import homeAddressPage from '../../../../pages/01-personal-information-chapter/homeAddress';

describe('Home address page', () => {
  it('renders the title and home address fields', () => {
    const { container, getByText } = render(
      <SchemaForm
        name="homeAddress"
        title={homeAddressPage.title}
        schema={homeAddressPage.schema}
        uiSchema={homeAddressPage.uiSchema}
        data={{
          homeAddress: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            postalCode: '12345',
            country: 'United States',
          },
        }}
        onChange={() => {}}
        onSubmit={() => {}}
      />,
    );

    getByText('Primary home address');

    expect($('va-checkbox', container).getAttribute('label')).to.eq(
      'I live on a U.S. military base outside of the United States.',
    );
    expect($('va-checkbox', container).getAttribute('checked')).to.eq('false');

    expect($('va-select[label="Country"]', container)).to.exist;
    expect($('va-text-input[label="Street address"]', container)).to.exist;
    // expect($('va-text-input[label="Street address line 2"]', container)).to
    //   .exist;
    expect($('va-text-input[label="City"]', container)).to.exist;
    expect($('va-select[label="State"]', container)).to.exist;
    // expect($('va-text-input[label="Postal code"]', container)).to.exist;

    // const html = container.innerHTML;
    // expect(html).to.include('label="Street address"');
    // expect(html).to.include('label="city"');
    // expect(html).to.include('label="state"');
    // expect(html).to.include('label="Postal code"');
  });
});
