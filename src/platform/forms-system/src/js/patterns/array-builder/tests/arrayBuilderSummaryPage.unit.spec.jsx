/* eslint-disable no-unused-vars */
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { SET_DATA } from 'platform/forms-system/src/js/actions';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns/arrayBuilderPatterns';
import { updateSchemasAndData } from 'platform/forms-system/exportsFile';
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
  let minimalHeader;

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
    if (minimalHeader) {
      document.body.removeChild(minimalHeader);
      minimalHeader = null;
    }
    cleanup();
  });

  function setupArrayBuilderSummaryPage({
    urlParams = '',
    arrayData = [],
    title = 'Review your employers',
    required = () => false,
    maxItems = 5,
    isReviewPage = false,
    reviewErrors,
    text,
    uiSchema,
    schema,
    useButtonInsteadOfYesNo,
    useLinkInsteadOfYesNo,
  }) {
    const setFormData = sinon.spy();
    const goToPath = sinon.spy();
    let getText = helpers.initGetText({
      getItemName: item => item?.name,
      nounPlural: 'employers',
      nounSingular: 'employer',
      textOverrides: text,
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
      uiSchema:
        uiSchema !== undefined
          ? uiSchema
          : {
              'view:hasOption': arrayBuilderYesNoUI({
                arrayPath: 'employers',
                nounSingular: 'employer',
                required: false,
                maxItems,
              }),
            },
      schema:
        schema !== undefined
          ? schema
          : {
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
      isReviewPage,
      maxItems,
      nounPlural: 'employers',
      nounSingular: 'employer',
      required,
      summaryRoute: '/summary',
      introRoute: '/intro',
      reviewRoute: '/review',
      useButtonInsteadOfYesNo,
      useLinkInsteadOfYesNo,
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

    const { container, getByText } = render(
      <Provider store={mockStore}>
        <CustomPage
          schema={processedSchema}
          uiSchema={processedUiSchema}
          data={processedData}
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
      arrayData: [],
      urlParams: '',
      maxItems: 5,
    });

    expect(container.querySelector('va-radio')).to.exist;
    expect(container.querySelector('va-card')).to.not.exist;
    expect(container.querySelector('.wc-pattern-array-builder-yes-no')).to
      .exist;
  });

  it('should display appropriately with 1 items', () => {
    const { getText, container, getByText } = setupArrayBuilderSummaryPage({
      arrayData: [{ name: 'Test' }],
      urlParams: '',
      maxItems: 5,
    });

    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio).to.exist;
    expect(vaRadio.getAttribute('value')).to.equal('false');
    expect(container.querySelector('va-card')).to.exist;
  });

  it('should display appropriately with max items', () => {
    const { getText, container, getByText } = setupArrayBuilderSummaryPage({
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
    expect(container.querySelectorAll('va-card')).to.have.lengthOf(5);
    expect(container.querySelector('va-alert')).to.include.text(
      'You have added the maximum number',
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

  it('should display summaryTitleWithoutItems and summaryDescriptionWithoutItems text override when array is empty', () => {
    const { container } = setupArrayBuilderSummaryPage({
      arrayData: [],
      urlParams: '',
      maxItems: 5,
      text: {
        summaryTitleWithoutItems: 'Custom summary title',
        summaryDescriptionWithoutItems: 'Custom summary description',
        summaryTitle: 'Custom summary review title',
      },
    });

    const $fieldset = container.querySelector('fieldset');
    expect($fieldset).to.exist;
    const $legend = $fieldset.querySelector('legend');
    expect($legend).to.exist;
    expect($legend).to.include.text('Custom summary title');
    expect($legend).to.include.text('Custom summary description');
  });

  it('should display summaryTitle text override when array has data', () => {
    const { container } = setupArrayBuilderSummaryPage({
      arrayData: [{ name: 'Test' }],
      urlParams: '',
      maxItems: 5,
      text: {
        summaryTitleWithoutItems: 'Custom summary title',
        summaryDescriptionWithoutItems: 'Custom summary description',
        summaryTitle: 'Custom summary review title',
      },
    });

    const $fieldset = container.querySelector('fieldset');
    expect($fieldset).to.exist;
    const $legend = $fieldset.querySelector('legend');
    expect($legend).to.exist;
    expect($legend).to.include.text('Custom summary review title');
    const description = $fieldset.querySelector('p');
    expect(description).to.not.exist;
  });

  it('should display summaryDescription text override when array has data', () => {
    const { container } = setupArrayBuilderSummaryPage({
      arrayData: [{ name: 'Test' }],
      urlParams: '',
      maxItems: 5,
      text: {
        summaryDescription: 'Custom summary description',
        summaryTitle: 'Custom summary review title',
      },
    });

    const $fieldset = container.querySelector('fieldset');
    expect($fieldset).to.exist;
    const $legend = $fieldset.querySelector('legend');
    expect($legend).to.exist;
    expect($legend).to.include.text('Custom summary review title');
    const description = $fieldset.querySelector('span');
    expect(description).to.exist;
    expect(description).to.include.text('Custom summary description');
  });

  it('should allow for showing a link instead of a yes no question', () => {
    const { container } = setupArrayBuilderSummaryPage({
      arrayData: [{ name: 'Test' }],
      urlParams: '',
      uiSchema: {},
      schema: {
        type: 'object',
        properties: {},
      },
      useLinkInsteadOfYesNo: true,
    });

    expect(container.querySelector('va-link-action[name="employersAddLink"]'))
      .to.exist;
    expect(container.querySelector('va-button[name="employersAddButton"]')).to
      .not.exist;
    expect(container.querySelector('.wc-pattern-array-builder-yes-no')).to.not
      .exist;
  });

  it('should allow for showing a button instead of a yes no question', () => {
    const { container } = setupArrayBuilderSummaryPage({
      arrayData: [{ name: 'Test' }],
      urlParams: '',
      uiSchema: {},
      schema: {
        type: 'object',
        properties: {},
      },
      useButtonInsteadOfYesNo: true,
    });

    expect(container.querySelector('va-link-action[name="employersAddLink"]'))
      .to.not.exist;
    expect(container.querySelector('va-button[name="employersAddButton"]')).to
      .exist;
    expect(container.querySelector('.wc-pattern-array-builder-yes-no')).to.not
      .exist;
  });

  it('should allow empty schema with a link', () => {
    const { container } = setupArrayBuilderSummaryPage({
      arrayData: [{ name: 'Test' }],
      urlParams: '',
      uiSchema: {},
      schema: {
        type: 'object',
        properties: {},
      },
      useLinkInsteadOfYesNo: true,
    });

    expect(container.querySelector('va-link-action[name="employersAddLink"]'))
      .to.exist;
  });

  it('should display a removed item alert from 1 -> 0 items', async () => {
    const { container, setFormData } = setupArrayBuilderSummaryPage({
      arrayData: [{ name: 'Test' }],
      urlParams: '',
      maxItems: 5,
    });

    expect(container.querySelectorAll('va-card')).to.have.lengthOf(1);
    fireEvent.click(
      container.querySelector('va-button-icon[data-action="remove"]'),
    );
    const modal = container.querySelector('va-modal');
    expect(modal).to.have.attribute('visible');
    modal.__events.primaryButtonClick();
    await waitFor(() => {
      const alert = container.querySelector('va-alert');
      expect(alert).to.include.text('has been deleted');
      expect(setFormData.args[0][0].employers).to.have.lengthOf(0);
    });
  });

  it('should display a removed item alert from 2 -> 1 items', async () => {
    const { container, setFormData } = setupArrayBuilderSummaryPage({
      arrayData: [{ name: 'Test' }, { name: 'Test 2' }],
      urlParams: '',
      maxItems: 5,
    });

    expect(container.querySelector('va-card')).length(2);
    fireEvent.click(
      container.querySelector('va-button-icon[data-action="remove"]'),
    );
    const modal = container.querySelector('va-modal');
    expect(modal).to.have.attribute('visible');
    modal.__events.primaryButtonClick();
    await waitFor(() => {
      const alert = container.querySelector('va-alert');
      expect(alert).to.include.text('has been deleted');
      expect(setFormData.args[0][0].employers).to.have.lengthOf(1);
    });
  });

  it('radio should have h1 label-header-level if 0 items with minimal header', () => {
    sessionStorage.setItem('MINIMAL_HEADER_APPLICABLE', 'true');
    sessionStorage.setItem(
      'MINIMAL_HEADER_EXCLUDE_PATHS',
      '["/introduction","/confirmation"]',
    );
    minimalHeader = document.createElement('div');
    minimalHeader.id = 'header-minimal';
    minimalHeader.setAttribute(
      'data-exclude-paths',
      '["/introduction","/confirmation"]',
    );
    document.body.appendChild(minimalHeader);

    const { container } = setupArrayBuilderSummaryPage({
      arrayData: [],
      urlParams: '',
      maxItems: 5,
    });

    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio.getAttribute('label-header-level')).to.equal('1');

    sessionStorage.removeItem('MINIMAL_HEADER_APPLICABLE');
    sessionStorage.removeItem('MINIMAL_HEADER_EXCLUDE_PATHS');
  });

  it('radio should have h3 label-header-level if 0 items without minimal header', () => {
    const { container } = setupArrayBuilderSummaryPage({
      arrayData: [],
      urlParams: '',
      maxItems: 5,
    });

    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio.getAttribute('label-header-level')).to.equal('3');
  });

  it('title should be h1, card should have h2, and radio should have h2 label-header-level if 1+ items with minimal header', () => {
    sessionStorage.setItem('MINIMAL_HEADER_APPLICABLE', 'true');
    sessionStorage.setItem(
      'MINIMAL_HEADER_EXCLUDE_PATHS',
      '["/introduction","/confirmation"]',
    );
    minimalHeader = document.createElement('div');
    minimalHeader.id = 'header-minimal';
    minimalHeader.setAttribute(
      'data-exclude-paths',
      '["/introduction","/confirmation"]',
    );
    document.body.appendChild(minimalHeader);

    const { container } = setupArrayBuilderSummaryPage({
      arrayData: [{ name: 'Test' }],
      urlParams: '',
      maxItems: 5,
    });

    const title = container.querySelector('h1');
    expect(title).to.include.text('Review your employers');
    const card = container.querySelector('va-card');
    expect(card.querySelector('h2')).to.exist;
    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio.getAttribute('label-header-level')).to.equal('2');

    sessionStorage.removeItem('MINIMAL_HEADER_APPLICABLE');
    sessionStorage.removeItem('MINIMAL_HEADER_EXCLUDE_PATHS');
  });

  it('title should be h3, card should have h4, and radio should have h4 label-header-level if 1+ items without minimal header', () => {
    const { container } = setupArrayBuilderSummaryPage({
      arrayData: [{ name: 'Test' }],
      urlParams: '',
      maxItems: 5,
    });

    const title = container.querySelector('h3');
    expect(title).to.include.text('Review your employers');
    const cards = container.querySelectorAll('va-card');
    expect(cards.length).to.equal(1);
    expect(cards[0].querySelector('h4')).to.exist;
    const vaRadio = container.querySelector('va-radio');
    expect(vaRadio.getAttribute('label-header-level')).to.equal('4');
  });
});
