import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester } from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';
import { ERR_MSG_CSS_CLASS } from '../../constants';

describe('Disability benefits 4192', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.disabilities.pages.pastEmploymentFormIntro;

  it('renders 4192 form intro choices', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(4);
    form.unmount();
  });
  it('should require an option to be selected', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
});
