/* eslint-disable no-unused-vars */
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { SET_DATA } from 'platform/forms-system/src/js/actions';
import { cleanup, render, fireEvent, waitFor } from '@testing-library/react';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { arrayBuilderItemFirstPageTitleUI } from 'platform/forms-system/src/js/web-component-patterns/arrayBuilderPatterns';
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

describe('ArrayBuilderFirstItemPage', () => {
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

  function setupArrayBuilderItemPage({
    index = 0,
    urlParams = '',
    arrayData = [],
    title = 'Name and address of employer',
    lowerCase = true,
    hasMultipleItemPages = true,
    required = () => false,
    fullData = {},
    duplicateChecks = {},
    useWebComponent = false,
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
        ...arrayBuilderItemFirstPageTitleUI({
          title,
          nounSingular: 'employer',
          lowerCase,
          hasMultipleItemPages,
        }),
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
      getSummaryPath: () => '/summary',
      getIntroPath: () => '/intro',
      reviewRoute: '/review',
      getText,
      required,
      fullData,
      duplicateChecks,
      currentPath: '/employers/:index/information',
    });

    const { container, queryByText } = render(
      <Provider store={mockStore}>
        <CustomPage
          schema={itemPage.schema}
          uiSchema={itemPage.uiSchema}
          data={data.employers[index]}
          fullData={fullData}
          onChange={() => {}}
          onSubmit={() => {}}
          onReviewPage={false}
          goToPath={goToPath}
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

    return { setFormData, goToPath, getText, container, queryByText };
  }

  it('should display React FormNav buttons', () => {
    const { container, queryByText } = setupArrayBuilderItemPage({
      title: 'Single page employer',
      index: 0,
      urlParams: '?add=true',
      arrayData: [{ name: 'Employer One' }],
      hasMultipleItemPages: false,
      useWebComponent: false,
    });
    expect(
      container.querySelector(
        '.form-progress-buttons button.usa-button-primary',
      ),
    ).to.exist;
  });

  it('should display web component FormNav buttons', () => {
    const { container, queryByText } = setupArrayBuilderItemPage({
      title: 'Single page employer',
      index: 0,
      urlParams: '?add=true',
      arrayData: [{ name: 'Employer One' }],
      hasMultipleItemPages: false,
      useWebComponent: true,
    });
    expect(
      container.querySelector('.form-progress-buttons va-button[continue]'),
    ).to.exist;
  });

  it('should display correctly with add query parameter', () => {
    const { getText, container, queryByText } = setupArrayBuilderItemPage({
      title: 'Name and address of employer',
      index: 0,
      urlParams: '?add=true',
      arrayData: [{ name: 'Test' }],
    });

    expect(queryByText('Name and address of employer')).to.exist;
    expect(container.querySelector('va-button[text="cancelAddButtonText"]')).to
      .exist;
  });

  it('should display correctly with edit query parameter', async () => {
    const { getText, container, queryByText } = setupArrayBuilderItemPage({
      title: 'Name and address of employer',
      index: 0,
      urlParams: '?edit=true',
      arrayData: [{ name: 'Test' }],
    });

    // Wait for the useEffect to run and update the schema
    await waitFor(() => {
      expect(queryByText('Edit name and address of employer')).to.exist;
    });
    expect(container.querySelector('va-button[text="cancelEditButtonText"]')).to
      .exist;
  });

  it('should display correctly with edit query parameter is not lowercased', async () => {
    const { getText, container, queryByText } = setupArrayBuilderItemPage({
      title: 'John Doe employer information',
      lowerCase: false,
      index: 0,
      urlParams: '?edit=true',
      arrayData: [{ name: 'Test' }],
    });

    await waitFor(() => {
      expect(queryByText('Edit John Doe employer information')).to.exist;
    });
    expect(container.querySelector('va-button[text="cancelEditButtonText"]')).to
      .exist;
  });

  it('should display correctly when hasMultipleItemPages is true', async () => {
    const { container, queryByText } = setupArrayBuilderItemPage({
      title: 'Multiple page employer',
      index: 0,
      urlParams: '?edit=true',
      arrayData: [{ name: 'Employer One' }],
      hasMultipleItemPages: true,
    });

    await waitFor(() => {
      expect(
        queryByText(
          'We’ll take you through each of the sections of this employer for you to review and edit',
        ),
      ).to.exist;
    });
    expect(container.querySelector('va-button[text="cancelEditButtonText"]')).to
      .exist;
  });

  it('should display correctly when hasMultipleItemPages is false', async () => {
    const { container, queryByText } = setupArrayBuilderItemPage({
      title: 'Single page employer',
      index: 0,
      urlParams: '?edit=true',
      arrayData: [{ name: 'Employer One' }],
      hasMultipleItemPages: false,
    });

    await waitFor(() => {
      expect(container.querySelector('va-button[text="cancelEditButtonText"]'))
        .to.exist;
    });
    expect(
      queryByText(
        'We’ll take you through each of the sections of this employer for you to review and edit',
      ),
    ).to.not.exist;
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

  it('should show possible duplicate modal warning while attempting to navigate away, then choosing "yes, cancel"', async () => {
    const arrayData = [{ name: 'FullName' }, { name: 'FullName' }];
    const {
      goToPath,
      container,
      setFormData,
      getText,
    } = setupArrayBuilderItemPage({
      title: 'Name and address of employer',
      index: 0,
      urlParams: '?add=true',
      arrayData,
      required: () => false,
      duplicateChecks: {
        comparisons: ['name'],
        itemPathModalChecks: {
          information: {
            comparisons: ['name'],
          },
        },
      },
      fullData: {
        employers: arrayData,
      },
      useWebComponent: true,
    });

    await fireEvent.submit(container.querySelector('form'));

    await waitFor(() => {
      expect(goToPath.notCalled).to.be.true;
      expect(container.querySelector('va-modal[visible="true"]')).to.exist;
    }).then(() => {
      expect(getText.calledWith('duplicateModalTitle')).to.be.true;
      expect(getText.calledWith('duplicateModalDescription')).to.be.true;
      expect(getText.calledWith('duplicateModalPrimaryButtonText')).to.be.true;
      expect(getText.calledWith('duplicateModalSecondaryButtonText')).to.be
        .true;
      // click No, Cancel
      container.querySelector('va-modal').__events.primaryButtonClick();
      expect(goToPath.calledWith('/summary')).to.be.true;
      expect(setFormData.args[0][0]).to.deep.equal({
        employers: arrayData.slice(1),
        metadata: {},
      });
    });
  });

  it('should not show possible duplicate modal warning while attempting to navigate away, then choosing "no, continue"', async () => {
    const arrayData = [{ name: 'FullName' }, { name: 'FullName' }];
    const { goToPath, container, setFormData } = setupArrayBuilderItemPage({
      title: 'Name and address of employer',
      index: 0,
      urlParams: '?add=true',
      arrayData,
      required: () => false,
      duplicateChecks: {
        comparisons: ['name'],
        itemPathModalChecks: {
          information: {
            comparisons: ['name'],
          },
        },
      },
      fullData: {
        employers: arrayData,
      },
      useWebComponent: true,
    });

    await fireEvent.submit(container.querySelector('form'));

    await waitFor(() => {
      expect(goToPath.notCalled).to.be.true;
      expect(container.querySelector('va-modal[visible="true"]')).to.exist;
    }).then(() => {
      // click Yes, Continue
      container.querySelector('va-modal').__events.secondaryButtonClick();
      expect(goToPath.notCalled).to.be.true;
      expect(setFormData.args[0][0]).to.deep.equal({
        employers: arrayData,
        [helpers.META_DATA_KEY]: {
          'employers;fullname;allowDuplicate': true,
        },
      });
    });
  });

  it('should show possible duplicate modal warning while attempting to navigate away, then closing the modal', async () => {
    const arrayData = [{ name: 'FullName' }, { name: 'FullName' }];
    const { goToPath, container, setFormData } = setupArrayBuilderItemPage({
      title: 'Name and address of employer',
      index: 0,
      urlParams: '?add=true',
      arrayData,
      required: () => false,
      duplicateChecks: {
        comparisons: ['name'],
        itemPathModalChecks: {
          information: {
            comparisons: ['name'],
          },
        },
      },
      fullData: {
        employers: arrayData,
      },
      useWebComponent: true,
    });

    await fireEvent.submit(container.querySelector('form'));

    await waitFor(() => {
      expect(goToPath.notCalled).to.be.true;
      expect(container.querySelector('va-modal[visible="true"]')).to.exist;
    }).then(() => {
      // click Yes, Cancel
      container.querySelector('va-modal').__events.closeEvent();
      expect(goToPath.notCalled).to.be.true;
      expect(setFormData.notCalled).to.be.true;
      expect(container.querySelector('va-modal[visible="false"]')).to.exist;
    });
  });

  it('should show possible duplicate modal warning for external comparisons only while attempting to navigate away', async () => {
    const arrayData = [{ name: 'FullName' }, { name: 'FullName' }];
    const {
      goToPath,
      container,
      setFormData,
      getText,
    } = setupArrayBuilderItemPage({
      title: 'Name and address of employer',
      index: 0,
      urlParams: '?add=true',
      arrayData,
      required: () => false,
      duplicateChecks: {
        comparisons: ['name'],
        itemPathModalChecks: {
          information: {
            comparisonType: 'external',
            externalComparisonData: () => [['FullName']],
          },
        },
      },
      fullData: {
        employers: arrayData,
      },
      useWebComponent: true,
    });

    await fireEvent.submit(container.querySelector('form'));

    await waitFor(() => {
      expect(goToPath.notCalled).to.be.true;
      expect(container.querySelector('va-modal[visible="true"]')).to.exist;
      expect(getText.calledWith('duplicateModalTitle')).to.be.true;
      expect(getText.calledWith('duplicateModalDescription')).to.be.true;
      expect(getText.calledWith('duplicateModalPrimaryButtonText')).to.be.true;
      expect(getText.calledWith('duplicateModalSecondaryButtonText')).to.be
        .true;
    });
  });
});
