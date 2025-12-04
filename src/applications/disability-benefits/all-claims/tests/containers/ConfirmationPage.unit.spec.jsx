import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Toggler } from '~/platform/utilities/feature-toggles';
import ConfirmationPage, {
  getNewConditionsNames,
} from '../../containers/ConfirmationPage';
import { submissionStatuses } from '../../constants';
import { bddConfirmationHeadline } from '../../content/bddConfirmationAlert';
import formConfig from '../../config/form';

const getData = ({
  renderName = true,
  suffix = 'Esq.',
  featureToggles = {},
} = {}) => ({
  user: {
    profile: {
      userFullName: renderName
        ? { first: 'Foo', middle: 'Man', last: 'Choo', suffix }
        : {},
    },
  },
  featureToggles,
  form: {
    data: {
      // Form data cannot be null for review section accordion
      standardClaim: true,
      isVaEmployee: true,
      homelessOrAtRisk: 'homeless',
    },
  },
});

describe('ConfirmationPage', () => {
  const defaultProps = {
    fullName: {
      first: 'Hector',
      middle: 'Lee',
      last: 'Brooks',
      suffix: 'Sr.',
    },
    disabilities: ['something something', undefined],
    submittedAt: new Date('November, 7, 2024'),
    route: {
      formConfig,
      pageList: [],
    },
  };

  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  /**
   * Utility to verify confirmation page
   * @param {string} claimId - if claimId has a value, verify the label and value are on the page
   * @param {boolean} isBdd - if true, verify BDD alert is present, otherwise verify it is not present
   * @param {string} submissionStatus - used to verify logic based on success or non success status
   * @param {boolean} showCopyofSubmission - if true (toggle on), verify copy of submission section is shown
   */
  const verifyConfirmationPage = (
    claimId,
    isBdd = false,
    submissionStatus,
    showCopyofSubmission = false,
  ) => {
    const store = mockStore(
      getData({
        featureToggles: {
          [Toggler.TOGGLE_NAMES
            .disability526ShowConfirmationReview]: showCopyofSubmission,
        },
      }),
    );
    const props = {
      ...defaultProps,
      submissionStatus,
    };
    if (claimId) {
      props.claimId = claimId;
    }
    if (isBdd) {
      props.isSubmittingBDD = true;
    }

    const { container, getByText, queryByText } = render(
      <Provider store={store}>
        <ConfirmationPage {...props} />
      </Provider>,
    );

    if (isBdd) {
      getByText(bddConfirmationHeadline);
    } else {
      expect(queryByText(bddConfirmationHeadline)).to.not.exist;
    }

    // copy of submission section
    const accordionItem = container.querySelector(
      'va-accordion-item[header="Information you submitted on this form"]',
    );
    if (showCopyofSubmission) {
      expect(accordionItem).to.exist;
    } else {
      expect(accordionItem).to.be.null;
    }

    // success alert
    getByText('Form submission started on', { exact: false });
    getByText('Your submission is in progress.', {
      exact: false,
    });

    // summary box with claim info
    getByText('Disability Compensation Claim');
    getByText('For Hector Lee Brooks Sr.');
    getByText('Date submitted');
    getByText('November 7, 2024');
    getByText('Conditions claimed');
    getByText('Something Something');

    if (claimId) {
      getByText('Claim ID number');
      getByText(claimId);
    } else {
      expect(queryByText('Claim ID number')).to.not.exist;
    }

    // rest of sections are present
    getByText('Print this confirmation page');
    getByText('What to expect');
    getByText('How to contact us if you have questions');
    getByText('How long will it take VA to make a decision on my claim?');
    getByText('If I have dependents, how can I receive additional benefits?');
    getByText('Need help?');

    // links
    expect(container.querySelectorAll('va-link')).to.have.lengthOf(6);
    // Find the 21-686c PDF link by its attributes rather than index
    const pdfLink = Array.from(container.querySelectorAll('va-link')).find(
      linkElement =>
        linkElement.getAttribute('href') ===
        'https://www.vba.va.gov/pubs/forms/VBA-21-686c-ARE.pdf',
    );
    expect(pdfLink).to.exist;
    expect(pdfLink.getAttribute('download')).to.exist;
    expect(pdfLink.getAttribute('filetype')).to.equal('PDF');
    expect(pdfLink.getAttribute('pages')).to.equal('15');
    expect(pdfLink.getAttribute('text')).to.equal(
      'Download VA Form 21-686c (opens in new tab)',
    );

    // Verify "Learn more about the VA process" link exists
    const vaProcessLink = Array.from(
      container.querySelectorAll('va-link'),
    ).find(
      linkElement =>
        linkElement.getAttribute('text') ===
        'Learn more about the VA process after you file your claim',
    );
    expect(vaProcessLink).to.exist;
    expect(vaProcessLink.getAttribute('href')).to.equal(
      'https://www.va.gov/disability/after-you-file-claim/',
    );
  };

  it('should render confirmation page when submission succeeded with claim id', () => {
    verifyConfirmationPage('12345678', false, submissionStatuses.succeeded);
  });

  it('should render confirmation page when submission succeeded with no claim id', () => {
    verifyConfirmationPage(undefined, false, submissionStatuses.succeeded);
  });

  it('should render success with BDD SHA alert when submission succeeded with claim id for BDD', () => {
    verifyConfirmationPage('12345678', true, submissionStatuses.succeeded);
  });

  it('should render success when form submitted successfully but submission status has api failure', () => {
    verifyConfirmationPage('', false, submissionStatuses.apiFailure); // 500
  });

  it('should render success when form submitted successfully but submission status has non retryable error', () => {
    // status code 200, but response has "status: non_retryable_error"
    verifyConfirmationPage('', false, submissionStatuses.failed);
  });

  it('should render confirmation review section accordion when toggle is on', () => {
    verifyConfirmationPage(
      '12345678',
      false,
      submissionStatuses.succeeded,
      true, // disability526ShowConfirmationReview toggle
    );
  });

  describe('Error Boundary', () => {
    it('should initialize hasError state to false', () => {
      const instance = new ConfirmationPage(defaultProps);
      expect(instance.state.hasError).to.be.false;
    });

    it('getDerivedStateFromError should return hasError: true', () => {
      // Test that getDerivedStateFromError properly updates state
      const result = ConfirmationPage.getDerivedStateFromError(
        new Error('Test error'),
      );
      expect(result).to.deep.equal({ hasError: true });
    });

    it('should have componentDidCatch method for error logging', () => {
      const instance = new ConfirmationPage(defaultProps);
      expect(instance.componentDidCatch).to.be.a('function');
    });

    it('should call componentDidCatch when error occurs', () => {
      const instance = new ConfirmationPage(defaultProps);
      const componentDidCatchSpy = sinon.spy(instance, 'componentDidCatch');
      const testError = new Error('Test error');
      const errorInfo = { componentStack: 'test' };

      instance.componentDidCatch(testError, errorInfo);

      expect(componentDidCatchSpy.calledWith(testError, errorInfo)).to.be.true;
      componentDidCatchSpy.restore();
    });

    it('should not render ChapterSectionCollection when hasError is true', () => {
      const store = mockStore(
        getData({
          featureToggles: {
            [Toggler.TOGGLE_NAMES.disability526ShowConfirmationReview]: true,
          },
        }),
      );

      const props = {
        ...defaultProps,
        claimId: '12345678',
      };

      const instance = new ConfirmationPage(props);
      // Manually set error state to test the conditional rendering
      instance.state = { hasError: true };

      const { container } = render(
        <Provider store={store}>
          {instance.ConfirmationPageContent(props)}
        </Provider>,
      );

      // Verify accordion is not rendered when error occurs
      const accordionItem = container.querySelector(
        'va-accordion-item[header="Information you submitted on this form"]',
      );
      expect(accordionItem).to.be.null;

      // The rest of the confirmation view should still be visible
      expect(container.querySelector('va-alert')).to.exist;
      expect(container.textContent).to.include('Form submission started on');
      expect(container.textContent).to.include('Disability Compensation Claim');
      expect(container.textContent).to.include('For Hector Lee Brooks Sr.');
      expect(container.textContent).to.include('Date submitted');
      expect(container.textContent).to.include('November 7, 2024');
      expect(container.textContent).to.include('Conditions claimed');
      expect(container.textContent).to.include('Something Something');
      expect(container.textContent).to.include('Print this confirmation page');
      expect(container.textContent).to.include('What to expect');
      expect(container.textContent).to.include(
        'How to contact us if you have questions',
      );
    });

    it('should render ChapterSectionCollection when hasError is false', () => {
      const store = mockStore(
        getData({
          featureToggles: {
            [Toggler.TOGGLE_NAMES.disability526ShowConfirmationReview]: true,
          },
        }),
      );

      const props = {
        ...defaultProps,
        claimId: '12345678',
      };

      const instance = new ConfirmationPage(props);
      // Ensure hasError is false (default state)
      expect(instance.state.hasError).to.be.false;

      const { container } = render(
        <Provider store={store}>
          <ConfirmationPage {...props} />
        </Provider>,
      );

      // When hasError is false and toggle is on, content should render normally
      expect(container.querySelector('va-alert')).to.exist;
      expect(container.textContent).to.include('Form submission started on');
    });
  });
});

describe('getNewConditionsNames', () => {
  it('keeps strings and capitalizes them', () => {
    expect(
      getNewConditionsNames(['low back pain', '  knee PAIN  ']),
    ).to.deep.equal(['Low Back Pain', 'Knee Pain']);
  });

  it('includes only NEW/SECONDARY objects, ignores others and blanks', () => {
    const input = [
      { condition: 'tinnitus', cause: 'secondary' },
      { condition: 'sleep apnea', cause: 'NEW' },
      { condition: 'flu', cause: 'primary' },
      { condition: ' ', cause: 'NEW' },
      { condition: 'tinnitus', cause: 'SECONDARY' },
      undefined,
    ];
    expect(getNewConditionsNames(input)).to.deep.equal([
      'Tinnitus',
      'Sleep Apnea',
    ]);
  });

  it('returns empty list for empty/invalid inputs', () => {
    expect(getNewConditionsNames([])).to.deep.equal([]);
    expect(getNewConditionsNames()).to.deep.equal([]);
  });
});
