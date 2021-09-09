import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import {
  DefinitionTester,
  selectCheckbox,
  fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';

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

    expect(form.find('input[type="checkbox"]').length).to.equal(4);
    expect(form.find('h3').text()).to.equal('Tinnitus \u2014 January 1, 2021');
    form.unmount();
  });

  it('should not allow submit when nothing is checked', () => {
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
  it('should not allow submit when other is checked with no additional text', () => {
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

    selectCheckbox(form, 'root_disagreementOptions_other', true);
    form.find('form').simulate('submit');
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
  it('should allow submit when an area (not other) is checked', () => {
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
  it('should allow submit when other is checked with additional text', () => {
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

    selectCheckbox(form, 'root_disagreementOptions_other', true);
    fillData(form, '[name="root_otherEntry"]', 'foo');
    form.find('form').simulate('submit');
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
