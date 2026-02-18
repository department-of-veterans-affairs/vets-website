import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import nameDateOfBirthPage from '../../../../pages/01-personal-information-chapter/nameDateOfBirth';

describe('Name and date of birth page', () => {
  it('renders the title, subtitle, full name, and date of birth fields', () => {
    const { container, getByText } = render(
      <SchemaForm
        name="nameDateOfBirth"
        title={nameDateOfBirthPage.title}
        schema={nameDateOfBirthPage.schema}
        uiSchema={nameDateOfBirthPage.uiSchema}
        data={{}}
        onChange={() => {}}
        onSubmit={() => {}}
      />,
    );

    expect(getByText('Name and date of birth')).to.exist;
    expect(
      getByText(
        'Use your legal name as it appears on your government documentation.',
      ),
    ).to.exist;

    const firstNameInput = container.querySelector(
      'va-text-input[label="First or given name"]',
    );
    const lastNameInput = container.querySelector(
      'va-text-input[label="Last or family name"]',
    );
    const middleNameInput = container.querySelector(
      'va-text-input[label="Middle name"]',
    );
    const suffixSelect = container.querySelector('va-select[label="Suffix"]');
    expect(firstNameInput).to.exist;
    expect(lastNameInput).to.exist;
    expect(middleNameInput).to.exist;
    expect(suffixSelect).to.exist;

    const dobInput = container.querySelector(
      'va-memorable-date[label="Date of birth"]',
    );
    expect(dobInput).to.exist;
  });
});
