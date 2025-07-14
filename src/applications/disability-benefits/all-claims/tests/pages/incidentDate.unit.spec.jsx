import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillDate,
} from 'platform/testing/unit/schemaform-utils';
import { waitFor } from '@testing-library/dom';
import formConfig from '../../config/form';

describe('781 Incident Date', () => {
  const page = formConfig.chapters.disabilities.pages.incidentDate0;
  const { schema, uiSchema, arrayPath } = page;

  it('should render', async () => {
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input').length).to.equal(1);
    expect(form.find('select').length).to.equal(2);
    form.unmount();
  });

  it('should fill in incident date', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    fillDate(form, 'root_incident0_incidentDate', '2016-07-10');
    await waitFor(() => {
      form.find('form').simulate('submit');

      expect(form.find('.usa-input-error-message').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
    form.unmount();
  });
  it('should allow parttially filled in incident date', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    fillDate(form, 'root_incident0_incidentDate', '2016-07-XX');
    await waitFor(() => {
      form.find('form').simulate('submit');

      expect(form.find('.usa-input-error-message').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
    form.unmount();
  });
  it('should allow submission if no incident date submitted', async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
    form.unmount();
  });
});
