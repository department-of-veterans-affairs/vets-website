import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import {
  DefinitionTester,
  selectCheckbox,
  fillData,
} from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';

describe('area of disagreement page', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.conditions.pages.areaOfDisagreementFollowUp;

  const data = {
    areaOfDisagreement: [
      {
        attributes: {
          ratingIssueSubjectText: 'Tinnitus',
          approxDecisionDate: '2021-01-01',
        },
      },
    ],
  };

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={{}}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={data}
      />,
    );

    expect(form.find('input[type="checkbox"]').length).to.equal(3);
    expect(form.find('input[type="text"]').length).to.equal(1);
    expect(form.find('h3').text()).to.contain('Tinnitus');
    expect(form.find('.decision-date').text()).to.contain('January 1, 2021');
    form.unmount();
  });

  it('should not allow submit when nothing is checked and the input is blank', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={{}}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={data}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
  it('should allow submit when an area is checked', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={{}}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={data}
        onSubmit={onSubmit}
      />,
    );

    selectCheckbox(form, 'root_disagreementOptions_serviceConnection', true);
    form.find('form').simulate('submit');
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
  it('should allow submit with additional text', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={{}}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={data}
        onSubmit={onSubmit}
      />,
    );

    fillData(form, '[name="root_otherEntry"]', 'foo');
    form.find('form').simulate('submit');
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
