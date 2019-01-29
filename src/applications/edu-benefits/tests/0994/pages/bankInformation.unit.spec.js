import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import {
  DefinitionTester,
  fillData,
  selectRadio,
} from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../../0994/config/form.js';

import { ERR_MSG_CSS_CLASS } from '../../../0994/constants';

const initialData = {
  bankAccount: {
    accountType: 'checking',
    routingNumber: '021000021',
    accountNumber: '0000000000000000',
  },
};

describe('Bank Information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.personalInformation.pages.bankInformation;

  it('renders the bank information', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(4);

    form.unmount();
  });

  it('successfully submits ', () => {
    const {
      accountType,
      accountNumber,
      routingNumber,
    } = initialData.bankAccount;
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        uiSchema={uiSchema}
      />,
    );

    selectRadio(form, 'root_bankAccount_accountType', accountType);
    fillData(form, 'input#root_bankAccount_accountNumber', accountNumber);
    fillData(form, 'input#root_bankAccount_routingNumber', routingNumber);

    form.find('form').simulate('submit');

    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should not allow submission without bank info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(3);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
});
