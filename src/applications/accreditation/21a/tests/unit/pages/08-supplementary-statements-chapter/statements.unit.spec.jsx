import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import statements from '../../../../pages/08-supplementary-statements-chapter/statements';

describe('Statements Page', () => {
  const formData = {
    supplementalStatement: 'Test supplemental statement',
    personalStatement: 'Test personal statement',
  };
  it('renders the checkbox options and description', () => {
    const form = render(
      <DefinitionTester
        schema={statements.schema}
        uiSchema={statements.uiSchema}
        data={{ formData }}
      />,
    );
    const { container } = form;
    expect($('va-textarea[label="Optional supplemental statement"]', container))
      .to.exist;
    expect($('va-textarea[label="Optional personal statement"]', container)).to
      .exist;
  });
});
