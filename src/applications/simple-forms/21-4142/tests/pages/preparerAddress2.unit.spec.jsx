import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';
import {
  preparerIdentificationFields,
  veteranIsSelfText,
} from '../../definitions/constants';

const {
  schema,
  uiSchema,
} = formConfig.chapters.preparerAddress.pages.preparerAddress2;

describe('preparer address page 2', () => {
  it('should have appropriate number of fields', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          [preparerIdentificationFields.parentObject]: {
            [preparerIdentificationFields.relationshipToVeteran]: veteranIsSelfText,
            [preparerIdentificationFields.preparerHasSameAddressAsVeteran]: false,
          },
        }}
        formData={{}}
      />,
    );

    expect(container.querySelectorAll('input, select')).to.have.lengthOf(6);
  });

  it('should show the correct number of errors on submit', () => {
    const { getByRole, queryAllByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          [preparerIdentificationFields.parentObject]: {
            [preparerIdentificationFields.relationshipToVeteran]: veteranIsSelfText,
            [preparerIdentificationFields.preparerHasSameAddressAsVeteran]: false,
          },
        }}
        formData={{}}
      />,
    );

    getByRole('button', { name: /submit/i }).click();
    const errors = queryAllByRole('alert');
    expect(errors).to.have.lengthOf(4);
  });
});
