import React from 'react';
import { expect } from 'chai';
// import sinon from 'sinon';
import { DefinitionTester } from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

describe('Add Secondary Stressful Incident Description', () => {
  const { schema, uiSchema } = formConfig.chapters.introductionPage.pages.stressfulIncidentSecondaryDescription;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}/>
    );

    expect(form.find('textarea').length).to.equal(1);
  });
});
