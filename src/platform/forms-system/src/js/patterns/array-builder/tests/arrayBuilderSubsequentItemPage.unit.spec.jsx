/* eslint-disable no-unused-vars */
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { SET_DATA } from 'platform/forms-system/src/js/actions';
import { render } from '@testing-library/react';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { arrayBuilderItemSubsequentPageTitleUI } from 'platform/forms-system/src/js/web-component-patterns/arrayBuilderPatterns';
import ArrayBuilderItemPage from '../ArrayBuilderItemPage';
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

describe('ArrayBuilderSubsequentItemPage', () => {
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

  function setupArrayBuilderItemPage({
    index = 0,
    urlParams = '',
    arrayData = [],
    title = 'First Credit Union employment history',
    description = undefined,
    lowerCase = true,
    required = () => false,
  }) {
    const setFormData = sinon.spy();
    const goToPath = sinon.spy();
    let getText = key => key;
    getText = sinon.spy(getText);
    stubUrlIndex(index);
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
        ...arrayBuilderItemSubsequentPageTitleUI(title, description, lowerCase),
        name: {
          'ui:title': 'Name of employer',
          'ui:webComponentField': VaTextInputField,
        },
      },
      schema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
        },
        required: ['name'],
      },
    };

    const CustomPage = ArrayBuilderItemPage({
      arrayPath: 'employers',
      getIntroPath: () => '/intro',
      getSummaryPath: () => '/summary',
      reviewRoute: '/review',
      getText,
      required,
    });

    const { container, queryByText } = render(
      <Provider store={mockStore}>
        <CustomPage
          schema={itemPage.schema}
          uiSchema={itemPage.uiSchema}
          data={data.employers[index]}
          fullData={data}
          onChange={() => {}}
          onSubmit={() => {}}
          onReviewPage={false}
          goToPath={goToPath}
          name={title}
          title={title}
          appStateData={{}}
          pagePerItemIndex={index}
          formContext={{}}
        />
      </Provider>,
    );

    return {
      setFormData,
      goToPath,
      getText,
      container,
      queryByText,
    };
  }

  it('should display correctly with add query parameter', () => {
    const { getText, container, queryByText } = setupArrayBuilderItemPage({
      title: 'First Credit Union employment history',
      description: 'description text',
      index: 0,
      urlParams: '?add=true',
      arrayData: [{ name: 'Test' }],
    });

    expect(queryByText('First Credit Union employment history')).to.exist;
    expect(queryByText('description text')).to.exist;
    expect(container.querySelector('va-button[text="cancelAddButtonText"]')).to
      .exist;
  });

  it('should display correctly with edit query parameter', () => {
    const { getText, container, queryByText } = setupArrayBuilderItemPage({
      title: 'Employment history',
      index: 0,
      urlParams: '?edit=true',
      arrayData: [{ name: 'Test' }],
    });

    expect(queryByText('Edit employment history')).to.exist;
    expect(container.querySelector('va-button[text="cancelEditButtonText"]')).to
      .exist;
  });

  it('should display correctly with edit query parameter is not lowercased', () => {
    const { getText, container, queryByText } = setupArrayBuilderItemPage({
      title: 'John Doe employer information',
      lowerCase: false,
      index: 0,
      urlParams: '?edit=true',
      arrayData: [{ name: 'Test' }],
    });

    expect(queryByText('Edit John Doe employer information')).to.exist;
    expect(queryByText('description text')).to.not.exist;
    expect(container.querySelector('va-button[text="cancelEditButtonText"]')).to
      .exist;
  });

  it('should display correctly with edit query parameter is not lowercased', () => {
    const { getText, container, queryByText } = setupArrayBuilderItemPage({
      title: 'John Doe employer information',
      description: 'description text',
      lowerCase: false,
      index: 0,
      urlParams: '?edit=true',
      arrayData: [{ name: 'Test' }],
    });

    expect(queryByText('Edit John Doe employer information')).to.exist;
    expect(queryByText('description text')).to.exist;
    expect(container.querySelector('va-button[text="cancelEditButtonText"]')).to
      .exist;
  });

  it('should navigate away if not edit or add', () => {
    const { goToPath, container, queryByText } = setupArrayBuilderItemPage({
      title: 'Name and address of employer',
      index: 0,
      urlParams: '',
      arrayData: [{ name: 'Test' }],
      required: () => false,
    });

    expect(goToPath.calledWith('/summary')).to.be.true;
  });
});
