import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';
import {
  preparerIdentificationFields,
  veteranDirectRelative,
} from '../../definitions/constants';

const {
  schema,
  uiSchema,
} = formConfig.chapters.preparerPersonalInformation.pages.preparerPersonalInformation;

describe('preparer personal information page', () => {
  it('should have appropriate number of fields for direct relative', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          [preparerIdentificationFields.parentObject]: {
            [preparerIdentificationFields.relationshipToVeteran]:
              veteranDirectRelative[0],
          },
        }}
        formData={{}}
      />,
    );

    expect(
      container.querySelectorAll('input, select, textarea'),
    ).to.have.lengthOf(4);
  });

  it('should have appropriate number of fields for third-party (or any non-veteran/relative text)', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          [preparerIdentificationFields.parentObject]: {
            [preparerIdentificationFields.relationshipToVeteran]: 'Third-party',
          },
        }}
        formData={{}}
      />,
    );

    expect(
      container.querySelectorAll('input, select, textarea'),
    ).to.have.lengthOf(7);
  });

  it('should show the correct number of errors on submit for direct relative', () => {
    const { getByRole, queryAllByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          [preparerIdentificationFields.parentObject]: {
            [preparerIdentificationFields.relationshipToVeteran]:
              veteranDirectRelative[0],
          },
        }}
        formData={{}}
      />,
    );

    getByRole('button', { name: /submit/i }).click();
    const errors = queryAllByRole('alert');
    expect(errors).to.have.lengthOf(2);
  });

  it('should show the correct number of errors on submit for third-party (or any non-veteran/relative text)', () => {
    const { getByRole, queryAllByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          [preparerIdentificationFields.parentObject]: {
            [preparerIdentificationFields.relationshipToVeteran]: 'Third-party',
          },
        }}
        formData={{}}
      />,
    );

    getByRole('button', { name: /submit/i }).click();
    const errors = queryAllByRole('alert');
    expect(errors).to.have.lengthOf(2);
  });
});
