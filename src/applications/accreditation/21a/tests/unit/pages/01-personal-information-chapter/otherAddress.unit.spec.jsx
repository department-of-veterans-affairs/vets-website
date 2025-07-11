import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import otherAddressPage from '../../../../pages/01-personal-information-chapter/otherAddress';

describe('Other address page', () => {
  it('renders the title, subtitle, and address fields', () => {
    const { container, getByText } = render(
      <SchemaForm
        name="otherAddress"
        title={otherAddressPage.title}
        schema={otherAddressPage.schema}
        uiSchema={otherAddressPage.uiSchema}
        data={{
          otherAddress: {
            country: 'United States',
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            postalCode: '12345',
          },
        }}
        onChange={() => {}}
        onSubmit={() => {}}
      />,
    );

    expect(getByText('Other address')).to.exist;
    expect(
      getByText('We will send information about your form to this address.'),
    ).to.exist;

    const vaCheckbox = container.querySelector('va-checkbox');
    expect(vaCheckbox).to.exist;
    expect(vaCheckbox.getAttribute('label')).to.include('military base');
  });
});
