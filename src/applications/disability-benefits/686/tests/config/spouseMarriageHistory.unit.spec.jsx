import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('686 spouse marriage history', () => {
  const marriageHistory =
    formConfig.chapters.currentSpouseInfo.pages.spouseMarriageHistory;
  const uiSchema = marriageHistory.uiSchema.spouseMarriages.items;
  const schema = marriageHistory.schema.properties.spouseMarriages.items;
  const depends = marriageHistory.depends;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{
          marriages: [
            {
              spouseFullName: {
                first: 'Jane',
                last: 'Doe',
              },
            },
          ],
        }}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(12);
    expect(form.find('select').length).to.equal(4);
    expect(form.find('#root_dateOfMarriage-label').text()).to.contain(
      'Jane Doe',
    );
    form.unmount();
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(9);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('depends should return true if married and spouse was married before', () => {
    const result = depends({
      maritalStatus: 'MARRIED',
      spouseMarriages: [],
    });

    expect(result).to.be.true;
  });
});
