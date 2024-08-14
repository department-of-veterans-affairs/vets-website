import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

const mockStore = configureMockStore();

const payload = {
  application: {
    veteran: {
      serviceRecords: [
        {
          serviceBranch: 'NAVY',
          highestRank: 'ADM',
        },
      ],
    },
  },
};

const store = mockStore({
  form: {
    data: payload,
  },
});

describe('Pre-need sponsor military history', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.militaryHistory.pages.sponsorMilitaryHistory;

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

    expect(form.find('input').length).to.equal(2);
    expect(form.find('select').length).to.equal(1);
    expect(form.find('va-memorable-date').length).to.equal(2);
    form.unmount();
  });
});
