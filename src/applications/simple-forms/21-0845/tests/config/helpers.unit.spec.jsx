import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { pageFocusScroll } from '../../config/helpers';
import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.disclosureInfoChapter.pages.organizationNamePage;

describe('should perform a scroll correctly', async () => {
  it('should perform a scroll correctly', async () => {
    const { container } = render(
      <div>
        <h2 id="nav-form-header">Header</h2>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
        />
      </div>,
    );

    // This may not be actually performing a practical test
    // but it just helps code coverage to run it
    pageFocusScroll()();

    await waitFor(() => {
      const element = container.querySelector('#nav-form-header');
      expect(document.activeElement).to.eq(element);
    });
  });
});
