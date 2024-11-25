import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';
import { newSchema, oldSchema } from '../../pages/evidenceVaRecords';
import { SC_NEW_FORM_DATA } from '../../constants';

describe('Supplemental Claims VA evidence page', () => {
  const {
    schema,
    uiSchema,
    appStateSelector,
  } = formConfig.chapters.evidence.pages.evidenceVaRecords;

  const uiOptions = uiSchema['ui:options'];

  // Custom page is rendered, so this renders a submit button
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

    expect($('button[type="submit"]', container)).to.exist;
  });

  it('should return feature toggle in appStateSelector', () => {
    const state = { form: { data: { [SC_NEW_FORM_DATA]: true } } };
    expect(appStateSelector(state)).to.deep.equal({ [SC_NEW_FORM_DATA]: true });
  });
  it('should return feature toggle as false in appStateSelector', () => {
    const state = { form: {} };
    expect(appStateSelector(state)).to.deep.equal({
      [SC_NEW_FORM_DATA]: false,
    });
  });

  it('should set schema to use original VA evidence schema', () => {
    const result = uiOptions.updateSchema();
    expect(result).to.deep.equal(oldSchema);
  });
  it('should set schema to use original VA evidence schema', () => {
    const result = uiOptions.updateSchema({ [SC_NEW_FORM_DATA]: true });
    expect(result).to.deep.equal(newSchema);
  });
});
