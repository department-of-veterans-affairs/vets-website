import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { mockFetch } from 'platform/testing/unit/helpers';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

const mockStore = configureMockStore();

const payload = {
  claimant: {
    hasCurrentlyBuried: '1',
  },
};

const store = mockStore({
  form: {
    data: payload,
  },
});

const response = {
  data: [
    {
      id: 915,
      type: 'preneeds_cemeteries',
      attributes: {
        // eslint-disable-next-line camelcase
        cemetery_id: '915',
        name: 'ABRAHAM LINCOLN NATIONAL CEMETERY',
        // eslint-disable-next-line camelcase
        cemetery_type: 'N',
        num: '915',
      },
    },
  ],
};

describe('Pre-need burial benefits', () => {
  beforeEach(() => mockFetch(response));
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.burialBenefits.pages.burialCemetery;

  it('should render', () => {
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    expect(form.find('input').length).to.equal(1);
    form.unmount();
  });

  it('should fill in desired cemetery', done => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          onSubmit={onSubmit}
          uiSchema={uiSchema}
        />{' '}
      </Provider>,
    );

    const cemeteryField = form.find(
      'input#root_application_claimant_desiredCemetery',
    );
    cemeteryField.simulate('focus').simulate('change', {
      target: { value: 'ABRAHAM LINCOLN NATIONAL CEMETERY' },
    });

    setTimeout(() => {
      cemeteryField
        .simulate('keyDown', { key: 'ArrowDown', keyCode: 40 })
        .simulate('keyDown', { key: 'Enter', keyCode: 13 })
        .simulate('blur');

      // have to pull this again, doesn't work if we use cemeteryField
      expect(
        form.find('input#root_application_claimant_desiredCemetery').props()
          .value,
      ).to.equal('ABRAHAM LINCOLN NATIONAL CEMETERY');

      form.unmount();
      done();
    });
  });
});
