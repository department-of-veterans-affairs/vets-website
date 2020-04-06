import React from 'react';
import sinon from 'sinon';
import { DefinitionTester } from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

describe('Add secondary other sources of information help ', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.secondaryOtherSourcesHelp0;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:selectablePtsdTypes': {
            'view:combatPtsdType': true,
          },
          otherSources0: true,
        }}
        formData={{}}
      />,
    );

    expect(form.find('input').length).toBe(2);
    form.unmount();
  });

  it('should submit', () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <DefinitionTester
        definitions={formConfig}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:selectablePtsdTypes': {
            'view:combatPtsdType': true,
          },
          otherSources0: true,
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).toBe(0);
    expect(onSubmit.called).toBe(true);
    form.unmount();
  });
});
