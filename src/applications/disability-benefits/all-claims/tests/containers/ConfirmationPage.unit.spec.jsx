import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Toggler } from '~/platform/utilities/feature-toggles';
import { ConfirmationView } from '~/platform/forms-system/src/js/components/ConfirmationView';
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
    verifyConfirmationPage(12345678, false, submissionStatuses.succeeded);
  });

  it('should render confirmation page when submission succeeded with no claim id', () => {
    verifyConfirmationPage(undefined, false, submissionStatuses.succeeded);
  });

  it('should render success with BDD SHA alert when submission succeeded with claim id for BDD', () => {
    verifyConfirmationPage(12345678, true, submissionStatuses.succeeded);
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
      12345678,
      false,
      submissionStatuses.succeeded,
      true, // disability526ShowConfirmationReview toggle
    );
  });

  describe('Error Boundary Tests', () => {
    let consoleErrorStub;
    let sinon;

    beforeEach(() => {
      sinon = require('sinon');
      consoleErrorStub = sinon.stub(console, 'error');
    });

    afterEach(() => {
      consoleErrorStub.restore();
    });

    it('should catch errors in ChapterSectionCollection and display the rest of the page', () => {
      // Stub ChapterSectionCollection to throw an error during render
      const chapterStub = sinon.stub(
        ConfirmationView,
        'ChapterSectionCollection',
      );
      chapterStub.throws(new Error('ChapterSectionCollection error'));

      try {
        const store = mockStore(
          getData({
            featureToggles: {
              [Toggler.TOGGLE_NAMES.disability526ShowConfirmationReview]: true,
            },
          }),
        );

        const { container, getByText, queryByText } = render(
          <Provider store={store}>
            <ConfirmationPage
              {...defaultProps}
              submissionStatus={submissionStatuses.succeeded}
            />
          </Provider>,
        );

        // ChapterSectionCollection accordion does not render (error boundary caught it)
        expect(queryByText('Information you submitted on this form')).to.not
          .exist;

        // No error UI shown to user (silent degradation via error boundary)
        const errorAlerts = container.querySelectorAll(
          'va-alert[status="error"]',
        );
        expect(errorAlerts.length).to.equal(0);

        // The rest of the confirmation page content is still visible
        expect(getByText('Disability Compensation Claim')).to.exist;
        expect(getByText('For Hector Lee Brooks Sr.')).to.exist;
        expect(getByText('Date submitted')).to.exist;
        expect(getByText('November 7, 2024')).to.exist;
        expect(getByText('Print this confirmation page')).to.exist;
        expect(getByText('What to expect')).to.exist;
      } finally {
        chapterStub.restore();
      }
    });
  });
});

describe('getNewConditionsNames', () => {
  it('keeps strings and capitalizes them', () => {
    expect(
      getNewConditionsNames(['low back pain', '  knee PAIN  ']),
    ).to.deep.equal(['Low Back Pain', 'Knee Pain']);
  });

  it('ignores blanks/invalids and dedupes', () => {
    expect(
      getNewConditionsNames([
        'tinnitus',
        ' ',
        null,
        undefined,
        'Tinnitus',
        'sleep apnea',
      ]),
    ).to.deep.equal(['Tinnitus', 'Sleep Apnea']);
  });

  it('returns empty list for empty/invalid inputs', () => {
    expect(getNewConditionsNames([])).to.deep.equal([]);
    expect(getNewConditionsNames()).to.deep.equal([]);
  });
});
