import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { mockFetch } from 'platform/testing/unit/helpers';
import formConfig from '../../config/form';

const response = {
  data: [
    {
      id: 915,
      type: 'preneeds_cemeteries',
      attributes: {
        // eslint-disable-next-line camelcase
        cemetery_id: '915',
        name: 'ABRAHAM LINCOLN NATIONAL CEMETERY',
        // eslint-disable-next-line camelcase
        cemetery_type: 'N',
        num: '915',
      },
    },
  ],
};

describe('Pre-need burial benefits', () => {
  beforeEach(() => mockFetch(response));
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.burialBenefits.pages.burialBenefits;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(4);
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

    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should fill in desired cemetery', done => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    const cemeteryField = form.find(
      'input#root_application_claimant_desiredCemetery',
    );
    cemeteryField.simulate('focus').simulate('change', {
      target: { value: 'ABRAHAM LINCOLN NATIONAL CEMETERY' },
    });

    setTimeout(() => {
      cemeteryField
        .simulate('keyDown', { key: 'ArrowDown', keyCode: 40 })
        .simulate('keyDown', { key: 'Enter', keyCode: 13 })
        .simulate('blur');
      expect(
        form.find('input#root_application_claimant_desiredCemetery').props()
          .value,
      ).to.equal('ABRAHAM LINCOLN NATIONAL CEMETERY');

      form.unmount();
      done();
    });
  });
});
