import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import sinon from 'sinon';
import YellowRibbonProgramRequestSummaryReview from '../../containers/YellowRibbonProgramRequestSummaryReview';
import { arrayBuilderOptions } from '../../helpers';
import * as helpers from '../../helpers';

// Mock ArrayBuilderSummaryPage
const MockArrayBuilderSummaryPage = () => {
  return <div data-testid="array-builder-summary">Array Builder Summary</div>;
};
const ArrayBuilderSummaryPageModule = require('platform/forms-system/src/js/patterns/array-builder/ArrayBuilderSummaryPage');

let arrayBuilderSummaryPageStub;

const createMockStore = (formData = {}) => {
  return configureStore({
    reducer: {
      form: (state = { data: formData, formErrors: {} }) => state,
    },
    preloadedState: {
      form: {
        data: formData,
        formErrors: {},
      },
    },
  });
};

describe('YellowRibbonProgramRequestSummaryReview', () => {
  let addMaxContributionsStub;

  beforeEach(() => {
    addMaxContributionsStub = sinon.stub(helpers, 'addMaxContributions');
    addMaxContributionsStub.returns(10);
    arrayBuilderSummaryPageStub = sinon
      .stub(ArrayBuilderSummaryPageModule, 'default')
      .callsFake(() => {
        return MockArrayBuilderSummaryPage;
      });
  });

  afterEach(() => {
    if (addMaxContributionsStub) {
      addMaxContributionsStub.restore();
    }
    if (arrayBuilderSummaryPageStub) {
      arrayBuilderSummaryPageStub.restore();
    }
  });

  it('should render AddEligibileStudents when yellowRibbonProgramRequest has items', () => {
    const formData = {
      yellowRibbonProgramRequest: [
        { maximumStudentsOption: 'specific', maximumStudents: 10 },
      ],
    };
    const store = createMockStore(formData);

    const props = {
      arrayBuilder: arrayBuilderOptions,
      data: formData,
      name: 'yellowRibbonProgramRequestSummary',
      title: 'Yellow Ribbon Program contributions',
      schema: {},
      uiSchema: {},
      formContext: {},
      formOptions: {},
      trackingPrefix: 'edu-0839-',
      onReviewPage: true,
    };

    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <YellowRibbonProgramRequestSummaryReview {...props} />
      </Provider>,
    );

    // Verify ArrayBuilderSummaryPage is rendered
    expect(getByTestId('array-builder-summary')).to.exist;

    // Verify AddEligibileStudents is rendered when there are items
    expect(getByText(/Total number of maximum eligible students reported:/i)).to
      .exist;
  });
});
