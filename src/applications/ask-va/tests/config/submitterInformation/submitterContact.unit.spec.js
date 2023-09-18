import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.submitterInfo.pages.submitterContactInfo;

describe('submitterContactPage', () => {
  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect($('h2', container).textContent).to.eq(
      "Submitter's Contact Information",
    );
  });
});
