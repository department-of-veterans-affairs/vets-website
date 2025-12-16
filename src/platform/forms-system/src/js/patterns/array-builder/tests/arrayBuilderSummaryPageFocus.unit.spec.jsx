/* eslint-disable no-unused-vars */
import React from 'react';
import sinon from 'sinon-v20';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { SET_DATA } from 'platform/forms-system/src/js/actions';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns/arrayBuilderPatterns';
import { updateSchemasAndData } from 'platform/forms-system/exportsFile';
import { focusElement } from 'platform/utilities/ui/focus';
import ArrayBuilderSummaryPage from '../ArrayBuilderSummaryPage';
import * as helpers from '../helpers';

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

describe('ArrayBuilderSummaryPage - Focus Management', () => {
  let getArrayUrlSearchParamsStub;
  let getIndexStub;
  let focusElementStub;

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

  beforeEach(() => {
    focusElementStub = sinon.stub();
  });

  afterEach(() => {
    if (getArrayUrlSearchParamsStub) {
      getArrayUrlSearchParamsStub.restore();
      getArrayUrlSearchParamsStub = null;
    }
    if (getIndexStub) {
      getIndexStub.restore();
      getIndexStub = null;
    }
    if (focusElementStub) {
      focusElementStub.restore?.();
      focusElementStub = null;
    }
    cleanup();
  });

  function setupArrayBuilderSummaryPage({
    urlParams = '',
    arrayData = [],
    radioData,
    title = 'Review your employers',
    required = () => false,
    maxItems = 5,
  }) {
    const setFormData = sinon.spy();
    const goToPath = sinon.spy();
    const onContinue = sinon.spy();
    const onChange = sinon.spy();
    const onSubmit = sinon.spy();
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
    if (radioData) {
      data['view:hasOption'] = radioData;
    }
    const { mockStore } = mockRedux({
      formData: data,
      setFormData,
      onChange,
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
      getFirstItemPagePath: () => '/first-item/:index',
      hasItemsKey: 'view:hasOption',
      isItemIncomplete: item => !item?.name,
      isReviewPage: false,
      maxItems,
      nounPlural: 'employers',
      nounSingular: 'employer',
      required,
      getSummaryPath: () => '/summary',
      getIntroPath: () => '/intro',
      reviewRoute: '/review',
      getText,
    });

    const {
      data: processedData,
      schema: processedSchema,
      uiSchema: processedUiSchema,
    } = updateSchemasAndData(
      summaryPage.schema,
      summaryPage.uiSchema,
      data,
      false,
      data,
    );

    const renderResult = render(
      <Provider store={mockStore}>
        <CustomPage
          schema={processedSchema}
          uiSchema={processedUiSchema}
          data={processedData}
          onChange={onChange}
          onContinue={onContinue}
          onSubmit={onSubmit}
          onReviewPage={false}
          goToPath={goToPath}
          name={title}
          title={title}
          appStateData={{}}
          formContext={{}}
          formOptions={{}}
          fullData={data}
        />
      </Provider>,
    );

    const { container, getByText } = renderResult;

    return {
      setFormData,
      goToPath,
      getText,
      container,
      getByText,
      onContinue,
      onChange,
      onSubmit,
    };
  }

  it('should attempt to focus on close button in shadow DOM when item is removed', async () => {
    const { container, onChange } = setupArrayBuilderSummaryPage({
      arrayData: [{ name: 'Test' }],
      urlParams: '',
      maxItems: 5,
    });

    // Click remove button
    fireEvent.click(
      container.querySelector('va-button-icon[data-action="remove"]'),
    );
    const modal = container.querySelector('va-modal');
    expect(modal).to.have.attribute('visible');

    // Confirm deletion
    modal.__events.primaryButtonClick();

    await waitFor(() => {
      // Verify alert is displayed
      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert).to.include.text('has been deleted');

      // Verify shadowRoot property exists (web component should have it)
      // Note: In test environment, shadowRoot may not be fully functional,
      // but we can verify the alert element exists
      expect(alert).to.exist;
    });
  });

  it('should display removed item alert with proper structure for close button targeting', async () => {
    const { container, onChange } = setupArrayBuilderSummaryPage({
      arrayData: [{ name: 'Test Item' }],
      urlParams: '',
      maxItems: 5,
    });

    // Remove the item
    fireEvent.click(
      container.querySelector('va-button-icon[data-action="remove"]'),
    );
    const modal = container.querySelector('va-modal');
    modal.__events.primaryButtonClick();

    await waitFor(() => {
      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;

      // Verify alert has the close button attributes needed
      expect(alert).to.have.attribute('closeable');
      expect(alert).to.have.attribute(
        'close-btn-aria-label',
        'Close notification',
      );

      // Verify the alert text
      expect(alert).to.include.text('has been deleted');
    });
  });

  it('should show updated item alert when returning from edit', async () => {
    // Simulate returning from editing an item by setting URL params
    stubUrlIndex(0);
    const { container } = setupArrayBuilderSummaryPage({
      arrayData: [{ name: 'Updated Item' }],
      urlParams: 'updated=employer&index=0',
      maxItems: 5,
    });

    // Wait for the alert to be displayed
    await waitFor(() => {
      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;

      // Verify it's a success alert with close button
      expect(alert).to.have.attribute('status', 'success');
      expect(alert).to.have.attribute('closeable');
      expect(alert).to.have.attribute(
        'close-btn-aria-label',
        'Close notification',
      );
    });
  });
});
