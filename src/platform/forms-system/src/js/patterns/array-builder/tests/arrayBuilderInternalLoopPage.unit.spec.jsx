/* eslint-disable no-unused-vars */
import React from 'react';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { cleanup, render, fireEvent, waitFor } from '@testing-library/react';
import {
  textUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderItemSubsequentPageTitleUI } from 'platform/forms-system/src/js/web-component-patterns/arrayBuilderPatterns';
import { SET_DATA } from 'platform/forms-system/src/js/actions';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import ArrayBuilderInternalLoopPage from '../ArrayBuilderInternalLoopPage';
import * as helpers from '../helpers';

const mockConditions = (valid = true) => [
  { name: 'Condition A', releaseInfo: true },
  { name: 'Condition B', releaseInfo: valid ? false : undefined },
  valid ? { name: 'Condition C', releaseInfo: true } : { name: '' },
];

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

describe('ArrayBuilderInternalLoopPage', () => {
  let getArrayUrlSearchParamsStub;
  let getIndexStub;
  let originalLocation;

  beforeEach(() => {
    // Save the original window.location href so we can restore it
    originalLocation = window.location.href;
  });

  function stubUrlParams(str) {
    // Create a proper URL from the current location and the new search params
    const url = new URL(originalLocation);
    url.search = str;

    // Replace window.location with a new URL-based object
    // JSDOM allows replacing window.location when properly deleted first
    delete window.location;
    window.location = new URL(url.toString());

    // Also stub the helper function for code paths that use it directly
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
    // Clean up React Testing Library renders to prevent test pollution
    cleanup();
    // Restore window.location
    if (originalLocation) {
      delete window.location;
      window.location = new URL(originalLocation);
    }
    if (getArrayUrlSearchParamsStub) {
      getArrayUrlSearchParamsStub.restore();
      getArrayUrlSearchParamsStub = null;
    }
    if (getIndexStub) {
      getIndexStub.restore();
      getIndexStub = null;
    }
  });

  const setupArrayBuilderInternalLoopPage = ({
    index = 0,
    urlParams = '',
    arrayData = [],
    title = 'Name and address of treatment facility',
    lowerCase = true,
    required = () => true,
    fullData = null,
    useWebComponent = false,
    maxItems = 4,
    useLinkInsteadOfYesNo = false,
  }) => {
    const setFormData = sinon.spy();
    const onSubmit = sinon.spy();
    let getText = key => key;
    getText = sinon.spy(getText);
    stubUrlIndex(index);
    stubUrlParams(urlParams);
    const data = { conditionsTreated: arrayData };
    const fullData2 = fullData || {
      treatmentRecords: [{ name: 'Treatment facility 1', ...data }],
    };

    const { mockStore } = mockRedux({
      formData: data,
      setFormData,
    });

    const itemPage = {
      uiSchema: {
        conditionsTreated: {
          ...arrayBuilderItemSubsequentPageTitleUI(
            ({ formData }) =>
              formData?.name
                ? `Conditions treated at ${formData.name}`
                : 'Conditions treated',
          ),
          items: {
            ...arrayBuilderItemSubsequentPageTitleUI('Condition treated'),
            name: {
              ...textUI(
                'List a condition the person received treatment for at this facility.',
              ),
            },
            releaseInfo: yesNoUI(
              'Can we release information about this condition?',
            ),
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          conditionsTreated: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                releaseInfo: { type: 'boolean' },
              },
              required: ['name', 'releaseInfo'],
            },
            // additionalItems is automatically generated
            additionalItems: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
                releaseInfo: {
                  type: 'boolean',
                },
              },
              required: ['name', 'releaseInfo'],
            },
          },
        },
        required: ['conditionsTreated'],
      },
    };

    const CustomPage = ArrayBuilderInternalLoopPage({
      arrayPath: 'treatmentRecords',
      getSummaryPath: () => '/summary',
      getIntroPath: () => '/intro',
      reviewRoute: '/review',
      getText: key => key,
      required,
      fullData: fullData2,
      currentPath: '/treatment-records/:index',
      nestedArrayOptions: {
        arrayPathKeys: ['treatmentRecords', 'conditionsTreated'],
        nounSingular: 'treated condition',
        nounPlural: 'treated conditions',
        isItemIncomplete: item =>
          !item?.name || typeof item?.releaseInfo !== 'boolean',
        required,
        useLinkInsteadOfYesNo,
        maxItems,
        text: {
          getItemName: item => item?.name || 'Untitled condition',
          cardDescription: item =>
            typeof item.releaseInfo === 'boolean' &&
            `${item?.releaseInfo ? 'Authorized' : 'Not authorized'} to release`,
        },
      },
    });

    const { container } = render(
      <Provider store={mockStore}>
        <div name="topScrollElement" />
        <CustomPage
          schema={itemPage.schema}
          uiSchema={itemPage.uiSchema}
          data={data}
          fullData={fullData2}
          onChange={() => {}}
          onSubmit={onSubmit}
          onReviewPage={false}
          goToPath={() => {}}
          name={title}
          title={title}
          appStateData={{}}
          pagePerItemIndex={index}
          formContext={{}}
          formOptions={{ useWebComponentForNavigation: useWebComponent }}
          setFormData={setFormData}
        />
      </Provider>,
    );

    return { setFormData, onSubmit, getText, container };
  };

  it('should render required page with title, 3 cards, add another radios & continue button when adding', () => {
    const { container } = setupArrayBuilderInternalLoopPage({
      title: 'Single page treatment facility',
      urlParams: '?add=true',
      arrayData: mockConditions(false),
      useWebComponent: false,
    });

    expect($('h3', container).textContent).to.eq('Conditions treated');
    const cards = $$('va-card', container);
    expect(cards).to.have.lengthOf(3);
    expect($('va-radio[required]', container)).to.exist;
    expect($('va-button[text*="Cancel adding this"]', container)).to.exist;
    expect($$('.form-progress-buttons button', container)).to.have.lengthOf(2);
  });

  it('should render required page with title, 3 cards (with some incomplete errors), add another radios & continue button when editing', () => {
    const { container } = setupArrayBuilderInternalLoopPage({
      title: 'Single page treatment facility',
      urlParams: '?edit=true',
      arrayData: mockConditions(false),
      useWebComponent: false,
    });

    expect($('h3', container).textContent).to.eq('Edit conditions treated');
    const cards = $$('va-card', container);
    expect(cards).to.have.lengthOf(3);
    expect($$('.has-incomplete-item-error', container)).to.have.lengthOf(2);
    expect($('va-radio[required]', container)).to.exist;
    expect($('va-button[submit]', container)).to.exist;
  });

  it('should render optional page with title, 3 cards (with some incomplete errors), add another radios & continue button when editing', () => {
    const { container } = setupArrayBuilderInternalLoopPage({
      title: 'Single page treatment facility',
      urlParams: '?edit=true',
      arrayData: mockConditions(false),
      required: () => false,
      useWebComponent: false,
    });

    expect($('h3', container).textContent).to.eq('Edit conditions treated');
    const cards = $$('va-card', container);
    expect(cards).to.have.lengthOf(3);
    const errors = $$('.has-incomplete-item-error', container);
    expect(errors).to.have.lengthOf(2);
    expect(errors[0].textContent).to.contain('INCOMPLETE');
    expect($('va-radio', container)).to.exist;
    expect($('va-radio[required="true"]', container)).to.not.exist;
    expect($('va-button[submit]', container)).to.exist;
  });

  it('should render a link to add another item', async () => {
    const { container, onSubmit } = setupArrayBuilderInternalLoopPage({
      title: 'Single page treatment facility',
      urlParams: '?edit=true',
      arrayData: mockConditions(),
      useLinkInsteadOfYesNo: true,
    });

    expect($('va-radio', container)).to.not.exist;
    const link = $('va-link-action', container);
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.eq(
      'Do you have another treated condition to add?',
    );
  });

  it('should not show radio when max items reached', async () => {
    const { container, onSubmit } = setupArrayBuilderInternalLoopPage({
      title: 'Single page treatment facility',
      urlParams: '?edit=true',
      arrayData: mockConditions(),
      maxItems: () => 3,
    });

    expect($('va-radio', container)).to.not.exist;

    await $('va-button[submit]', container).click();

    await waitFor(() => {
      expect(onSubmit.called).to.be.true;
      expect($('va-alert[status="warning"]', container).textContent).to.contain(
        'the maximum number of allowed treated conditions',
      );
    });
  });

  it('should render valid data, submit, and allow continue', async () => {
    const { container, onSubmit } = setupArrayBuilderInternalLoopPage({
      title: 'Single page treatment facility',
      urlParams: '?edit=true',
      arrayData: mockConditions(),
    });

    await $('va-radio', container)?.__events?.vaValueChange({
      detail: { value: 'N' },
    });

    await $('va-button[submit]', container)?.click();

    await waitFor(() => {
      expect(onSubmit.calledOnce).to.be.true;
      expect(onSubmit.args[0][0]?.formData.name).to.equal(
        'Treatment facility 1',
      );
    });
  });

  it('should render add another radio missing selection error', async () => {
    const { container, onSubmit } = setupArrayBuilderInternalLoopPage({
      title: 'Single page treatment facility',
      urlParams: '?edit=true',
      arrayData: mockConditions(),
    });

    await $('va-button[submit]', container)?.click();

    await waitFor(() => {
      expect(onSubmit.notCalled).to.be.true;
      expect($('va-radio', container).getAttribute('error')).to.contain(
        'Select yes or no',
      );
    });
  });

  it('should render add nested array page', async () => {
    const { container, onSubmit } = setupArrayBuilderInternalLoopPage({
      title: 'Single page treatment facility',
      urlParams: '?edit=true',
      arrayData: [],
    });

    // add new item page automatically rendered when array is empty
    await waitFor(() => {
      const input = $('va-text-input', container);
      expect(input).to.exist;
      expect(input.getAttribute('label')).to.eq(
        'List a condition the person received treatment for at this facility.',
      );
      const radio = $$('va-radio', container);
      expect(radio).to.exist;
      expect(radio[0].getAttribute('label')).to.eq(
        'Can we release information about this condition?',
      );
    });
  });

  it('should render edit nested array page', async () => {
    const { container, onSubmit } = setupArrayBuilderInternalLoopPage({
      title: 'Single page treatment facility',
      urlParams: '?edit=true',
      arrayData: mockConditions(),
    });

    // Click edit link
    await $('va-card[data-index="1"] va-link', container)?.click();

    await waitFor(() => {
      const input = $('va-text-input', container);
      expect(input).to.exist;
      expect(input.getAttribute('label')).to.eq(
        'List a condition the person received treatment for at this facility.',
      );
      const radio = $$('va-radio', container);
      expect(radio).to.exist;
      expect(radio[0].getAttribute('label')).to.eq(
        'Can we release information about this condition?',
      );
    });
  });
});
