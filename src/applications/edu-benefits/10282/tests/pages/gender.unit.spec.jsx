import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

const definitions = formConfig.defaultDefinitions;

describe('Edu 10282 contact information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.personalInformation.pages.applicantGender;
  it('renders the correct amount of inputs', () => {
    const form = mount(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('va-radio').length).to.equal(1);
    form.unmount();
  });

  it('should show errors when required fields are empty', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
        definitions={definitions}
        // data={formData}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('va-radio[error]').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
  it('should call gaGenderInfoHelpText when the additional info is clicked', () => {
    const gaSpy = sinon.spy(window.dataLayer, 'push');
    const form = mount(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    form.find('va-additional-info').simulate('click');
    expect(gaSpy.calledOnce).to.be.true;
    expect(gaSpy.firstCall.args[0]).to.deep.equal({
      event: 'edu-10282--form-IBM-SkillsBuild-program-gender-help-text-clicked',
      'help-text-label':
        'What to know before you decide to share your gender identity',
    });

    gaSpy.restore();
    form.unmount();
  });
});
