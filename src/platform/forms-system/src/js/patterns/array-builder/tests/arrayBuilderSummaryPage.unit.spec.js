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

const mockRedux = ({
  review = false,
  submitted = false,
  formData = {},
  onChange = () => {},
  setFormData = () => {},
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
        form: { data: formData },
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
    required = () => false,
    minItems = 3,
    maxItems = 5,
    isReviewPage = false,
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
    });

    const itemPage = {
      uiSchema: {
        'view:hasOption': arrayBuilderYesNoUI({
          arrayPath: 'employers',
          nounSingular: 'employer',
          required: false,
          minItems,
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
      minItems,
      maxItems,
      nounPlural: 'employers',
      nounSingular: 'employer',
      required,
      summaryRoute: '/summary',
      introRoute: '/intro',
      reviewRoute: '/review',
      getText,
    });

    const { container, getByText } = render(
      <Provider store={mockStore}>
        <CustomPage
          schema={itemPage.schema}
          uiSchema={itemPage.uiSchema}
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
      minItems: 3,
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
      minItems: 3,
      maxItems: 5,
    });

    expect(container.querySelector('va-radio')).to.exist;
    expect(container.querySelector('va-card')).to.exist;
  });

  it('should display validation error when selecting "No" and clicking continue with less than min items', () => {
    const { container, getByText } = setupArrayBuilderSummaryPage({
      title: 'Review your employers',
      arrayData: [{ name: 'Test' }],
      urlParams: '',
      minItems: 3,
      maxItems: 5,
    });

    const noRadioButtonLabel = container.querySelector(
      'label[for="root_view:isAVeteranNoinput"]',
    );
    fireEvent.click(noRadioButtonLabel);

    const continueButton = container.querySelector('button#16-continueButton');
    fireEvent.click(continueButton);

    const errorMessage = container.querySelector('span.usa-error-message');
    expect(errorMessage.textContent).to.include(
      'You need to add at least 1 more military service experience.',
    );
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
      minItems: 3,
      maxItems: 5,
    });

    expect(container.querySelector('va-radio')).to.exist;
    expect(container.querySelector('va-card')).to.exist;
  });

  it('should display validation when select "Yes" with max items', () => {
    const { getText, container, getByText } = setupArrayBuilderSummaryPage({
      title: 'Review your employers',
      arrayData: [{ name: 'Test' }],
      urlParams: '',
      minItems: 3,
      maxItems: 5,
    });

    const noRadioButtonLabel = container.querySelector(
      'label[for="root_view:isAVeteranYesinput"]',
    );
    fireEvent.click(noRadioButtonLabel);

    const continueButton = container.querySelector('button#16-continueButton');
    fireEvent.click(continueButton);

    const errorMessage = container.querySelector('span.usa-error-message');
    expect(errorMessage.textContent).to.include(
      'You cannot add more than 4 military service experiences.',
    );
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
      minItems: 3,
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
      minItems: 3,
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
      minItems: 3,
      maxItems: 5,
    });

    const $addButton = container.querySelector('va-button[data-action="add"]');
    expect($addButton).to.not.exist;
  });
});
