/* eslint-disable no-unused-vars */
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { SET_DATA } from 'platform/forms-system/src/js/actions';
import { render } from '@testing-library/react';
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
    maxItems = 5,
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
      isReviewPage: false,
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
});
