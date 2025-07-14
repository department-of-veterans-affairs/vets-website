import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
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

    expect(getByText('Primary home address')).to.exist;
    const html = container.innerHTML;
    expect(html).to.include('label="Street address"');
    expect(html).to.include('label="city"');
    expect(html).to.include('label="state"');
    expect(html).to.include('label="Postal code"');
  });
});
