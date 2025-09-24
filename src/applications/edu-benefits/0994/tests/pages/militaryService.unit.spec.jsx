import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import { mount } from 'enzyme';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { ERR_MSG_CSS_CLASS } from '../../constants';
import formConfig from '../../config/form';

describe('VET TEC military service', () => {
  let sandbox;
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.militaryService.pages.militaryService;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  const setDate = (form, momentObj) => {
    const month = form.find(`select[name="root_expectedReleaseDateMonth"]`);
    const day = form.find(`select[name="root_expectedReleaseDateDay"]`);
    const year = form.find(`input[name="root_expectedReleaseDateYear"]`);

    month.simulate('change', {
      target: { value: (momentObj.month() + 1).toString() },
    });

    day.simulate('change', {
      target: { value: momentObj.date().toString() },
    });

    year.simulate('change', {
      target: { value: momentObj.year().toString() },
    });
  };

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );
    expect(form.find('input').length).to.equal(2);
    form.unmount();
  });

  it('should require active duty', async () => {
    const onSubmit = sandbox.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');

    await waitFor(() => {
      form.update();
      expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(1);
      expect(form.find('.form-expanding-group-open').length).to.equal(0);
    });

    form.unmount();
  });

  it('should submit when active duty selected', () => {
    const onSubmit = sandbox.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
      />,
    );

    form.find(`input[name="root_activeDuty"][value="Y"]`).simulate('change', {
      target: { Y: 'Y' },
    });

    setDate(form, moment().add(2, 'days'));

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
