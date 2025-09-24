import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import placeOfBirthPage from '../../../../pages/01-personal-information-chapter/placeOfBirth';

describe('Place of birth page', () => {
  it('renders the title and place of birth fields', () => {
    const { container, getByText } = render(
      <SchemaForm
        name="placeOfBirth"
        title={placeOfBirthPage.title}
        schema={placeOfBirthPage.schema}
        uiSchema={placeOfBirthPage.uiSchema}
        data={{
          placeOfBirth: {
            city: 'Springfield',
            state: 'IL',
            country: 'United States',
          },
        }}
        onChange={() => {}}
        onSubmit={() => {}}
      />,
    );

    expect(getByText('Place of birth')).to.exist;
    const html = container.innerHTML;
    expect(html).to.include('label="city"');
    expect(html).to.include('label="state"');
    expect(html).to.include('label="Country"');
  });
});
