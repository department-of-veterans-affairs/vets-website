import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';
import initialData from '../schema/initialData.js';

describe('Higher-Level Review 0996 choose contested issues', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.contestedIssues.pages.contestedIssues;

  it('renders the contested issue selection field', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input[type="checkbox"]').length).to.equal(
      initialData.veteran.contestedIssues.length,
    );
    form.unmount();
  });

  it('successfully submits when at least one condition is selected', done => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        uiSchema={uiSchema}
      />,
    );

    // Simulating a click event doesn't trigger onChange, so we have to call it
    // explicitly
    form
      .find('input#root_veteran_contestedIssues_0')
      .props()
      .onChange({ target: { checked: true } });
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);

    setTimeout(() => {
      // Check step 2b content
      const text = form.find('contestedIssuesNotesStart').text();
      expect(text.includes('one by one')).to.be.true;
      form.unmount();
      done();
    }, 500);
  });

  it('prevents submission when no conditions selected', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    form.unmount();
  });

  it('renders the information about each disability', () => {
    const issues = initialData.veteran.contestedIssues;
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={initialData}
        uiSchema={uiSchema}
      />,
    );

    const labels = form.find('input[type="checkbox"] + label');
    labels.forEach((label, index) => {
      expect(label.find('h4').text()).to.equal(issues[index].name);
      expect(label.find('span').text()).to.equal(issues[index].description);
      expect(
        label
          .find('p')
          .last()
          .text(),
      ).to.equal(`Current rating: ${issues[index].ratingPercentage}%`);
    });
    form.unmount();
  });
});
