import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { ERR_MSG_CSS_CLASS } from '../../constants';

import {
  DefinitionTester,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('781a additonal events yes/no', () => {
  const page =
    formConfig.chapters.disabilities.pages.ptsdSecondaryAdditionalEvents0;
  const { schema, uiSchema, arrayPath } = page;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          'view:selectablePtsdTypes': {
            'view:mstPtsdType': true,
          },
        }}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input').length).to.equal(2);
    form.unmount();
  });

  it('should submit when no data is filled out', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:selectablePtsdTypes': {
            'view:mstPtsdType': true,
          },
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit when data filled in', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:selectablePtsdTypes': {
            'view:mstPtsdType': true,
          },
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    selectRadio(form, 'root_view:enterAdditionalSecondaryEvents0', 'Y');
    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
