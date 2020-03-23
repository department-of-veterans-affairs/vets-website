import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form';

describe('686 add child - child additional information', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.addChild.pages.addChildAdditionalInformation;

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
        childPlaceOfBirth: {
          state: 'California',
        },
        childStatus: {
          stepchild: false,
        },
        doesChildLiveWithYou: false,
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
    expect(form.find('input').length).to.equal(12);
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
    expect(form.find('.usa-input-error').length).to.equal(6);
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
    fillData(
      form,
      'input#root_childAddressInfo_personChildLivesWith_first',
      'Bill',
    );
    fillData(
      form,
      'input#root_childAddressInfo_personChildLivesWith_last',
      'Bob',
    );
    fillData(
      form,
      'input#root_childAddressInfo_childAddress_country',
      'United States',
    );
    fillData(
      form,
      'input#root_childAddressInfo_childAddress_street',
      'Sunny Road',
    );
    fillData(
      form,
      'input#root_childAddressInfo_childAddress_city',
      'Someplace',
    );
    fillData(form, 'input#root_childAddressInfo_childAddress_postal', '12345');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
