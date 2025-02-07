import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';
import { CONTESTABLE_ISSUES_PATH, SELECTED } from '../../../shared/constants';

describe('NOD selected issues summary page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.conditions.pages.issueSummary;
  const data = { contestedIssues: [{}] };

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          contestedIssues: [{ [SELECTED]: true }],
          additionalIssues: [{ [SELECTED]: true }],
        }}
        formData={{}}
      />,
    );

    expect(form.find('li').length).to.equal(2);
    form.unmount();
  });
  it('should render a link to the eligible issues page', () => {
    const form = mount(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={data}
        formData={{}}
      />,
    );

    const link = form.find('Link');

    expect(link.length).to.equal(1);
    expect(link.text()).to.contain('Go back to add more issues');
    expect(link.props().to.pathname).to.equal(CONTESTABLE_ISSUES_PATH);
    expect(link.props().to.search).to.equal('?redirect');
    form.unmount();
  });

  it('should allow continue', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={data}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
