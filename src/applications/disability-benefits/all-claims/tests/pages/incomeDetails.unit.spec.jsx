import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
} from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { waitFor } from '@testing-library/dom';
import formConfig from '../../config/form';
import initialData from '../initialData';

describe('Income Details Questions', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.disabilities.pages.incomeDetails;

  it('should render income details form', async () => {
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        uiSchema={uiSchema}
      />,
    );

    expect(form);
    expect(form.find('input').length).to.equal(3);
    form.unmount();
  });

  it('should add income details', async () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        uiSchema={uiSchema}
      />,
    );

    fillData(form, 'input#root_unemployability_mostEarningsInAYear', '10000');
    fillData(form, 'input#root_unemployability_yearOfMostEarnings', '2012');

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(onSubmit.called).to.be.false;
      expect(form.find('.usa-input-error').length).to.equal(0);
    });
    form.unmount();
  });

  it('should not submit when income is not all numbers', async () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        uiSchema={uiSchema}
      />,
    );

    fillData(form, 'input#root_unemployability_mostEarningsInAYear', 'abcde');

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(onSubmit.called).to.be.false;
      expect(form.find('.usa-input-error').length).to.equal(1);
    });
    form.unmount();
  });

  it('should not submit when year is not valid', async () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        uiSchema={uiSchema}
      />,
    );

    fillData(form, 'input#root_unemployability_yearOfMostEarnings', '0000');

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(onSubmit.called).to.be.false;
      expect(form.find('.usa-input-error').length).to.equal(1);
    });
    form.unmount();
  });
});
