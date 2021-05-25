import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import {
  DefinitionTester,
  selectCheckbox,
} from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form';
import { SELECTED } from '../../constants';

describe('eligible issues page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.conditions.pages.contestableIssues;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
      />,
    );

    expect(form.find('EligibleIssuesWidget').length).to.equal(1);
    form.unmount();
  });

  it('should allow submit when no issues are checked', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
  it('should allow submit when issues are checked', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          contestableIssues: [
            {
              type: 'contestableIssue',
              attributes: {
                ratingIssueSubjectText: 'Tinnitus',
                description: 'Rinnging in the ears.',
                ratingIssuePercentNumber: 10,
                approxDecisionDate: '2020-11-01',
              },
              [SELECTED]: false,
            },
            {
              type: 'contestableIssue',
              attributes: {
                ratingIssueSubjectText: 'Headaches',
                description: 'Acute chronic head pain',
                ratingIssuePercentNumber: 50,
                approxDecisionDate: '2020-11-10',
              },
            },
          ],
        }}
        onSubmit={onSubmit}
      />,
    );

    selectCheckbox(form, 'root_contestableIssues_1', true);
    form.find('form').simulate('submit');
    expect(form.find('[name="root_contestableIssues_1"]').props().checked).to.be
      .true;
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
