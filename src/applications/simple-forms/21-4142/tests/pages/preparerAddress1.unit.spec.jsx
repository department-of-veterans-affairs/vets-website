import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';
import {
  preparerIdentificationFields,
  veteranFields,
  veteranIsSelfText,
} from '../../definitions/constants';

const {
  schema,
  uiSchema,
} = formConfig.chapters.preparerAddress.pages.preparerAddress1;

describe('preparer address page 1', () => {
  it('should have appropriate number of fields', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          [veteranFields.parentObject]: {
            [veteranFields.address]: {
              street: '1 street',
              city: 'city',
              state: 'AL',
              postalCode: '15541',
            },
          },
          [preparerIdentificationFields.parentObject]: {
            [preparerIdentificationFields.relationshipToVeteran]: veteranIsSelfText,
          },
        }}
        formData={{}}
      />,
    );

    expect(container.querySelectorAll('input, select')).to.have.lengthOf(2);
  });

  it('should show the correct number of errors on submit', () => {
    const { getByRole, queryAllByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          [veteranFields.parentObject]: {
            [veteranFields.address]: {
              street: '1 street',
              city: 'city',
              state: 'AL',
              postalCode: '15541',
            },
          },
          [preparerIdentificationFields.parentObject]: {
            [preparerIdentificationFields.relationshipToVeteran]: veteranIsSelfText,
          },
        }}
        formData={{}}
      />,
    );

    getByRole('button', { name: /submit/i }).click();
    const errors = queryAllByRole('alert');
    expect(errors).to.have.lengthOf(0);
  });
});
