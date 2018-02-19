import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester, fillData } from '../../../util/schemaform-utils.jsx';
import formConfig from '../../../../src/js/vre/chapter36/config/form.js';

describe('VRE chapter 36 contact information', () => {
  describe('applicant address', () => {
    const { schema, uiSchema } = formConfig.chapters.contactInformation.pages.applicantAddress;
    it('renders applicant address form', () => {
      const form = mount(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{}}
          formData={{}}
          uiSchema={uiSchema}/>
      );
      expect(form.find('input').length).to.equal(4);
      expect(form.find('select').length).to.equal(2);
    });

    it('does not submit without required info', () => {
      const onSubmit = sinon.spy();
      const form = mount(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{}}
          formData={{}}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
      );

      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error').length).to.equal(4);

      expect(onSubmit.called).to.be.false;
    });

    it('submits with required info', () => {
      const onSubmit = sinon.spy();
      const form = mount(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{}}
          formData={{}}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
      );
      fillData(form, 'select#root_applicantAddress_country', 'USA');
      fillData(form, 'input#root_applicantAddress_street', '123 test st');
      fillData(form, 'input#root_applicantAddress_city', 'Los Angeles');
      fillData(form, 'select#root_applicantAddress_state', 'CA');
      fillData(form, 'input#root_applicantAddress_postalCode', '90034');

      form.find('form').simulate('submit');

      expect(form.find('.usa-input-error').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
  });
  describe('contact information', () => {
    const { schema, uiSchema } = formConfig.chapters.contactInformation.pages.contactInformation;
    it('renders applicant address form', () => {
      const form = mount(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{}}
          formData={{}}
          uiSchema={uiSchema}/>
      );
      expect(form.find('input').length).to.equal(4);
    });

    it('submits with info', () => {
      const onSubmit = sinon.spy();
      const form = mount(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{}}
          formData={{}}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
      );
      fillData(form, 'input#root_applicantHomePhone', '8017777777');
      fillData(form, 'input#root_applicantMobilePhone', '8017777777');
      fillData(form, 'input#root_applicantEmail', 'test@test.com');
      fillData(form, 'input[name="root_view:confirmEmail"]', 'test@test.com');

      form.find('form').simulate('submit');

      expect(form.find('.usa-input-error').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });

    it('does not submit with non matching email addresses', () => {
      const onSubmit = sinon.spy();
      const form = mount(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={{}}
          formData={{}}
          onSubmit={onSubmit}
          uiSchema={uiSchema}/>
      );
      fillData(form, 'input#root_applicantEmail', 'test@test.com');
      fillData(form, 'input[name="root_view:confirmEmail"]', 'test@nottest.com');

      form.find('form').simulate('submit');

      expect(form.find('.usa-input-error').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });
  });
});
