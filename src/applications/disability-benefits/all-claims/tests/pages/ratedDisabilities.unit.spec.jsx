import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { waitFor } from '@testing-library/dom';
import formConfig from '../../config/form';
import initialData from '../initialData';
import { NULL_CONDITION_STRING } from '../../constants';

describe('Disability benefits 526EZ -- Rated disabilities selection', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.ratedDisabilities;

  const store = {
    getState: () => ({
      form: {
        loadedData: {
          formData: {},
          metadata: {
            version: 99,
            returnUrl: '/',
            submission: {},
          },
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };

  it('renders the rated disabilities selection field', async () => {
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={initialData}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    expect(form.find('input[type="checkbox"]').length).to.equal(
      initialData.ratedDisabilities.length,
    );
    form.unmount();
  });

  it('successfully submits when at least one condition is selected', async () => {
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={initialData}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    // Simulating a click event doesn't trigger onChange, so we have to call it explicitly
    form
      .find('input#root_ratedDisabilities_0')
      .props()
      .onChange({ target: { checked: true } });
    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error').length).to.equal(0);
    });
    form.unmount();
  });

  it('successfully submits when no conditions selected', async () => {
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={initialData}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error').length).to.equal(0);
    });
    form.unmount();
  });

  it('renders the information about each disability', async () => {
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={initialData}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    const labels = form.find('input[type="checkbox"] + label');
    expect(
      labels
        .at(0)
        .find('h3')
        .text(),
    ).to.equal('Post Traumatic Stress Disorder');
    expect(
      labels
        .at(0)
        .find('p')
        .first()
        .text(),
    ).to.equal('Current rating: 40%');
    expect(
      labels
        .at(0)
        .find('p')
        .last()
        .text(),
    ).to.equal('You’re already at the maximum rating for this disability.');

    expect(
      labels
        .at(1)
        .find('h3')
        .text(),
    ).to.equal('Intervertebral Disc Syndrome');
    expect(
      labels
        .at(1)
        .find('p')
        .last()
        .text(),
    ).to.equal('Current rating: 0%');

    expect(
      labels
        .at(2)
        .find('h3')
        .text(),
    ).to.equal('Migraines');
    expect(
      labels
        .at(2)
        .find('p')
        .first()
        .text(),
    ).to.equal('Current rating: 100%');
    expect(
      labels
        .at(2)
        .find('p')
        .last()
        .text(),
    ).to.equal('You’re already at the maximum rating for this disability.');

    form.unmount();
  });

  it('renders and submits when unknown condition', async () => {
    const testData = JSON.parse(JSON.stringify(initialData));
    testData.ratedDisabilities[0].name = undefined;

    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={testData}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    const labels = form.find('input[type="checkbox"] + label');
    expect(
      labels
        .at(0)
        .find('h3')
        .text(),
    ).to.equal(NULL_CONDITION_STRING);
    expect(
      labels
        .at(0)
        .find('p')
        .last()
        .text(),
    ).to.equal(`You’re already at the maximum rating for this disability.`);

    // Simulating a click event doesn't trigger onChange, so we have to call it explicitly
    form
      .find('input#root_ratedDisabilities_0')
      .props()
      .onChange({ target: { checked: true } });
    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error').length).to.equal(0);
    });
    form.unmount();
  });
});
