import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import {
  DefinitionTester,
  fillData,
  selectCheckbox,
} from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form';

describe('686 add child - child place of birth', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.addChild.pages.addChildPlaceOfBirth;

  const formData = {
    'view:selectable686Options': {
      addChild: true,
    },
    childrenToAdd: [
      {
        first: 'Bill',
        last: 'Bob',
        ssn: '370947141',
        birthDate: '1997-04-02',
      },
    ],
  };

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        arrayPath={arrayPath}
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
      />,
    );
    expect(form.find('input').length).to.equal(8);
    form.unmount();
  });

  it('should not progress without the required fields', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        arrayPath={arrayPath}
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(3);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should progress with the required fields filled', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        arrayPath={arrayPath}
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
      />,
    );
    fillData(form, 'input#root_childPlaceOfBirth_state', 'California');
    fillData(form, 'input#root_childPlaceOfBirth_city', 'Someplace');
    selectCheckbox(form, 'root_childStatus_biological', true);

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
