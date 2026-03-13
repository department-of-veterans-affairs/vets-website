import React from 'react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { render } from '@testing-library/react';
import formConfig from '../../config/form';

describe('526 aid and attendance page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.aidAndAttendance;

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
      />,
    );
    expect(container.querySelector('va-radio')).to.exist;
    expect(container.querySelectorAll('va-radio-option').length).to.equal(2);
  });
});
