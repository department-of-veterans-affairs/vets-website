import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import { commonReducer } from 'platform/startup/store';

import formConfig from '../../config/form.js';
import initialData from '../initialData.js';
import reducers from '../../reducers';
import { ERR_MSG_CSS_CLASS } from '../../constants';

describe('Select related disabilities for unemployability', () => {
  const fakeStore = createStore(
    combineReducers({
      ...commonReducer,
      ...reducers,
    }),
  );

  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.unemployabilityDisabilities;

  it('renders the rated disabilities selection field', () => {
    const disabilitiesLength =
      initialData.ratedDisabilities.length + initialData.newDisabilities.length;
    const form = mount(
      <Provider store={fakeStore}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={initialData}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    expect(form.find('input[type="checkbox"]').length).to.equal(
      disabilitiesLength,
    );
    form.unmount();
  });

  it('successfully submits when at least one condition is selected', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={fakeStore}>
        <DefinitionTester
          onSubmit={onSubmit}
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={initialData}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    form
      .find('input#root_ratedDisabilities_0_2')
      .props()
      .onChange({ target: { checked: true } });
    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should not submit without at least one disability selected', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={fakeStore}>
        <DefinitionTester
          onSubmit={onSubmit}
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          data={initialData}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(2);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('renders the information about each disability', () => {
    const form = mount(
      <Provider store={fakeStore}>
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

    expect(
      labels
        .at(3)
        .find('h3')
        .text(),
    ).to.equal('CAD');

    expect(
      labels
        .at(4)
        .find('h3')
        .text(),
    ).to.equal('Cancer');

    form.unmount();
  });
});
