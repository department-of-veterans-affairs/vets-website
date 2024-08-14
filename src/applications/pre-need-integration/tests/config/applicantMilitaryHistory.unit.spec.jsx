import React from 'react';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import configureMockStore from 'redux-mock-store';
import formConfig from '../../config/form';

const mockStore = configureMockStore();

const payload = {
  application: {
    veteran: {
      serviceRecords: [
        {
          serviceBranch: 'ARMY',
          highestRank: 'SGT',
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

describe('Pre-need applicant military history', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.militaryHistory.pages.applicantMilitaryHistorySelf;

  it('should render HighestRankAutoSuggest without crashing', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <div>
        <Provider store={store}>
          <DefinitionTester
            schema={schema}
            data={{}}
            definitions={formConfig.defaultDefinitions}
            uiSchema={uiSchema}
          />
        </Provider>
      </div>,
    );

    expect(form.find('input').length).to.equal(2);
    expect(form.find('select').length).to.equal(2);
    expect(form.find('va-memorable-date').length).to.equal(2);
  });
});
