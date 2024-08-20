/* eslint-disable no-unused-vars */
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { SET_DATA } from 'platform/forms-system/src/js/actions';
import { fireEvent, render } from '@testing-library/react';
import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns/arrayBuilderPatterns';
import ArrayBuilderSummaryPage from '../ArrayBuilderSummaryPage';
import * as helpers from '../helpers';

const MOCK_REVIEW_ERRORS_EMPTY = {};
const MOCK_REVIEW_ERRORS_AT_LEAST_ONE = {
  errors: [
    {
      name: 'view:hasOption',
      index: null,
      message:
        'You must add at least one employer for us to process this form.',
      chapterKey: 'arrayMultiPageBuilder',
      pageKey: 'multiPageBuilderSummary',
    },
  ],
  rawErrors: [],
};

const mockRedux = ({
  review = false,
  submitted = false,
  formData = {},
  onChange = () => {},
  setFormData = () => {},
  formErrors,
} = {}) => {
  return {
    props: {
      onChange,
      formContext: {
        onReviewPage: review,
        reviewMode: review,
        submitted,
      },
      formData,
      setFormData,
    },
    mockStore: {
      getState: () => ({
        form: {
          data: formData,
          formErrors,
        },
        formContext: {
          onReviewPage: false,
          reviewMode: false,
          submitted: false,
          touched: {},
        },
      }),
      subscribe: () => {},
      dispatch: action => {
        if (action.type === SET_DATA) {
          return setFormData(action.data);
        }
        return null;
      },
    },
  };
};

describe('ArrayBuilderSummaryPage', () => {
  let getArrayUrlSearchParamsStub;
  let getIndexStub;

  function stubUrlParams(str) {
    getArrayUrlSearchParamsStub = sinon
      .stub(helpers, 'getArrayUrlSearchParams')
      .returns(new URLSearchParams(str));
  }

  function stubUrlIndex(index) {
    getIndexStub = sinon
      .stub(helpers, 'getArrayIndexFromPathName')
      .returns(index);
  }

  afterEach(() => {
    if (getArrayUrlSearchParamsStub) {
      getArrayUrlSearchParamsStub.restore();
      getArrayUrlSearchParamsStub = null;
    }
    if (getIndexStub) {
      getIndexStub.restore();
      getIndexStub = null;
    }
  });

  function setupArrayBuilderSummaryPage({
    urlParams = '',
    arrayData = [],
    title = 'Name and address of employer',
    customSummaryPageHeader,
    customSummaryPageDescription,
    required = () => false,
    maxItems = 5,
    isReviewPage = false,
    reviewErrors,
  }) {
    const setFormData = sinon.spy();
    const goToPath = sinon.spy();
    let getText = helpers.initGetText({
      getItemName: item => item?.name,
      nounPlural: 'employers',
      nounSingular: 'employer',
    });
    getText = sinon.spy(getText);
    stubUrlParams(urlParams);
    const data = {
      employers: arrayData,
    };
    const { mockStore } = mockRedux({
      formData: data,
      setFormData,
      formErrors: reviewErrors,
    });

    const summaryPage = {
      uiSchema: {
        'view:hasOption': arrayBuilderYesNoUI({
          arrayPath: 'employers',
          nounSingular: 'employer',
          required: false,
          maxItems,
        }),
      },
      schema: {
        type: 'object',
        properties: {
          'view:hasOption': arrayBuilderYesNoSchema,
        },
        required: ['view:hasOption'],
      },
    };

    const CustomPage = ArrayBuilderSummaryPage({
      arrayPath: 'employers',
      firstItemPagePath: '/first-item/:index',
      hasItemsKey: 'view:hasOption',
      isItemIncomplete: item => !item?.name,
      isReviewPage,
      maxItems,
      nounPlural: 'employers',
      nounSingular: 'employer',
      customSummaryPageHeader,
      customSummaryPageDescription,
      required,
      summaryRoute: '/summary',
      introRoute: '/intro',
      reviewRoute: '/review',
      getText,
    });

    const { container, getByText } = render(
      <Provider store={mockStore}>
        <CustomPage
          schema={summaryPage.schema}
          uiSchema={summaryPage.uiSchema}
          data={data}
          onChange={() => {}}
          onSubmit={() => {}}
          onReviewPage={false}
          goToPath={goToPath}
          name={title}
          title={title}
          appStateData={{}}
          formContext={{}}
        />
      </Provider>,
    );

    return { setFormData, goToPath, getText, container, getByText };
  }

  it('should display appropriately with 0 items', () => {
    const { getText, container, getByText } = setupArrayBuilderSummaryPage({
      title: 'Review your employers',
      arrayData: [],
      urlParams: '',
      maxItems: 5,
    });

    expect(container.querySelector('va-radio')).to.exist;
    expect(container.querySelector('va-card')).to.not.exist;
  });

  it('should display appropriately with 1 items', () => {
    const { getText, container, getByText } = setupArrayBuilderSummaryPage({
      title: 'Review your employers',
      arrayData: [{ name: 'Test' }],
      urlParams: '',
      maxItems: 5,
    });

    expect(container.querySelector('va-radio')).to.exist;
    expect(container.querySelector('va-card')).to.exist;
  });

  it('should display appropriately with max items', () => {
    const { getText, container, getByText } = setupArrayBuilderSummaryPage({
      title: 'Review your employers',
      arrayData: [
        { name: 'Test' },
        { name: 'Test 2' },
        { name: 'Test 3' },
        { name: 'Test 4' },
        { name: 'Test 5' },
      ],
      urlParams: '',
      maxItems: 5,
    });

    expect(container.querySelector('va-radio')).to.not.exist;
    expect(container.querySelector('va-card')).to.exist;
  });

  it('should remove all appropriately', () => {
    const {
      getText,
      container,
      goToPath,
      getByText,
      setFormData,
    } = setupArrayBuilderSummaryPage({
      title: 'Review your employers',
      arrayData: [{ name: 'Test' }],
      urlParams: '',
      maxItems: 5,
      required: () => true,
    });

    fireEvent.click(
      container.querySelector('va-button-icon[data-action="remove"]'),
    );
    const $modal = container.querySelector('va-modal');
    expect($modal.getAttribute('visible')).to.eq('true');
    $modal.__events.primaryButtonClick();
    expect(setFormData.called).to.be.true;
    expect(setFormData.args[0][0].employers).to.eql([]);
    expect(goToPath.args[0][0]).to.eql(
      '/first-item/0?add=true&removedAllWarn=true',
    );
  });

  it('should show an add button on the review page', () => {
    const { container, goToPath } = setupArrayBuilderSummaryPage({
      title: 'Review your employers',
      arrayData: [{ name: 'Test' }],
      urlParams: '',
      isReviewPage: true,
      maxItems: 5,
    });

    const $addButton = container.querySelector('va-button[data-action="add"]');
    expect($addButton).to.exist;
    fireEvent.click($addButton);
    expect(goToPath.args[0][0]).to.eql('/first-item/1?add=true&review=true');
  });

  it('should not show an add button on the review page if max items', () => {
    const { container } = setupArrayBuilderSummaryPage({
      title: 'Review your employers',
      arrayData: [
        { name: 'Test' },
        { name: 'Test 2' },
        { name: 'Test 3' },
        { name: 'Test 4' },
        { name: 'Test 5' },
      ],
      urlParams: '',
      isReviewPage: true,
      maxItems: 5,
    });

    const $addButton = container.querySelector('va-button[data-action="add"]');
    expect($addButton).to.not.exist;
  });

  it('should show an error alert on the review page if reviewErrors are present', () => {
    const { container } = setupArrayBuilderSummaryPage({
      title: 'Review your employers',
      arrayData: [],
      urlParams: '',
      isReviewPage: true,
      maxItems: 5,
      reviewErrors: MOCK_REVIEW_ERRORS_AT_LEAST_ONE,
    });

    const $errorAlert = container.querySelector(
      'va-alert[name="employersReviewError"]',
    );
    expect($errorAlert).to.include.text('at least one employer');
  });

  it('should not show an error alert on the review page if reviewErrors are not present', () => {
    const { container } = setupArrayBuilderSummaryPage({
      title: 'Review your employers',
      arrayData: [],
      urlParams: '',
      isReviewPage: true,
      maxItems: 5,
      reviewErrors: MOCK_REVIEW_ERRORS_EMPTY,
    });

    const $errorAlert = container.querySelector(
      'va-alert[name="employersReviewError"]',
    );
    expect($errorAlert).to.not.exist;
  });

  it('should display custom header and description when it is not the review page', () => {
    const { container } = setupArrayBuilderSummaryPage({
      title: 'Review your employers',
      customSummaryPageHeader: 'Custom header text',
      customSummaryPageDescription: 'Custom description text',
      arrayData: [],
      urlParams: '',
      maxItems: 5,
    });

    const $fieldset = container.querySelector('fieldset');
    expect($fieldset).to.exist;
    const $legend = $fieldset.querySelector('legend');
    expect($legend).to.exist;
    expect($legend).to.include.text('Custom header text');
    const description = $fieldset.querySelector('p');
    expect(description).to.exist;
    expect(description).to.include.text('Custom description text');
  });

  it('should not display custom header and description on the review page', () => {
    const { container } = setupArrayBuilderSummaryPage({
      title: 'Review your employers',
      customSummaryPageHeader: 'Custom header text',
      customSummaryPageDescription: 'Custom description text',
      arrayData: [],
      urlParams: '',
      isReviewPage: true,
      maxItems: 5,
    });

    const $fieldset = container.querySelector('fieldset');
    expect($fieldset).not.to.exist;
  });
});
