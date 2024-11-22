import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Toggler } from 'platform/utilities/feature-toggles';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import ConfirmationPage from '../../containers/ConfirmationPage';
import {
  submissionStatuses,
  WIZARD_STATUS,
  FORM_STATUS_BDD,
  SAVED_SEPARATION_DATE,
} from '../../constants';
import { bddConfirmationHeadline } from '../../content/bddConfirmationAlert';
import formConfig from '../../config/form';

const retryableErrorTitle =
  "It's taking us longer than expected to submit your claim.";

const getData = ({
  renderName = true,
  suffix = 'Esq.',
  disability526NewConfirmationPage = false,
} = {}) => ({
  user: {
    profile: {
      userFullName: renderName
        ? { first: 'Foo', middle: 'Man', last: 'Choo', suffix }
        : {},
    },
  },
  form: {
    data: {},
  },
  featureToggles: {
    loading: false,
    [Toggler.TOGGLE_NAMES
      .disability526NewConfirmationPage]: disability526NewConfirmationPage,
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

  const testPage = (status, otherProps) =>
    render(
      <Provider store={mockStore(getData())}>
        <ConfirmationPage
          submissionStatus={status}
          {...defaultProps}
          {...otherProps}
        />
        ,
      </Provider>,
    );

  it('should render success status', () => {
    const tree = testPage(submissionStatuses.succeeded);
    tree.getByText('Claim ID number');
    tree.getByText('Your claim has successfully been submitted.');
    tree.getByText('Date submitted');

    tree.getByText('Conditions claimed');
    tree.getByText('Something Something');
    tree.getByText('Unknown Condition');
  });

  it('should not render success with BDD SHA alert when not submitting BDD claim', () => {
    const { queryByText } = render(
      <Provider store={mockStore(getData())}>
        <ConfirmationPage
          submissionStatus={submissionStatuses.succeeded}
          {...defaultProps}
          isSubmittingBDD={false}
        />
        ,
      </Provider>,
    );

    expect(queryByText(bddConfirmationHeadline)).to.not.exist;
  });

  it('should render success with BDD SHA alert', () => {
    const tree = render(
      <Provider store={mockStore(getData())}>
        <ConfirmationPage
          submissionStatus={submissionStatuses.succeeded}
          {...defaultProps}
          isSubmittingBDD
        />
        ,
      </Provider>,
    );
    tree.getByText('Claim ID number');
    tree.getByText(bddConfirmationHeadline);
  });

  it('should render retry status', () => {
    const tree = testPage(submissionStatuses.retry);
    tree.getByText(retryableErrorTitle);
  });

  it('should render exhausted status', () => {
    const tree = testPage(submissionStatuses.exhausted);
    tree.getByText(retryableErrorTitle);
  });

  it('should render apiFailure status', () => {
    const tree = testPage(submissionStatuses.apiFailure);
    tree.getByText(retryableErrorTitle);
  });

  it('should render retryable failure with BDD SHA alert', () => {
    const tree = render(
      <Provider store={mockStore(getData())}>
        <ConfirmationPage
          submissionStatus={submissionStatuses.apiFailure}
          {...defaultProps}
          isSubmittingBDD
        />
        ,
      </Provider>,
    );

    tree.getByText(
      'Submit your Separation Health Assessment - Part A Self-Assessment now if you haven’t already',
    );
    tree.getByText(
      'Separation Health Assessment - Part A Self-Assessment (opens in new tab)',
    );
  });

  it('should render other status', () => {
    const tree = testPage(submissionStatuses.failed, { submissionId: '123' });
    tree.getByText(
      'We’re sorry. Something went wrong when we tried to submit your claim.',
    );
    tree.getByText('and provide this reference number 123', { exact: false });
  });

  it('should render note about email', () => {
    const props = {
      ...defaultProps,
    };

    const tree = render(
      <Provider store={mockStore(getData())}>
        <ConfirmationPage
          submissionStatus={submissionStatuses.succeeded}
          {...props}
        />
        ,
      </Provider>,
    );

    tree.getByText(
      'We’ll send you an email to confirm that we received your claim.',
    );
  });

  it('should not render email message when there is an error', () => {
    const props = {
      ...defaultProps,
      submissionStatus: submissionStatuses.failed,
    };

    const tree = render(
      <Provider store={mockStore(getData())}>
        <ConfirmationPage {...props} />
      </Provider>,
    );

    expect(
      tree.queryByText(
        'We’ll send you an email to confirm that we received your claim.',
      ),
    ).to.be.null;
  });

  it('should reset wizard state & values', () => {
    sessionStorage.setItem(WIZARD_STATUS, 'a');
    sessionStorage.setItem(FORM_STATUS_BDD, 'b');
    sessionStorage.setItem(SAVED_SEPARATION_DATE, 'c');

    const tree = testPage(submissionStatuses.succeeded);
    tree.getByText('Claim ID number');
    expect(sessionStorage.getItem(WIZARD_STATUS)).to.be.null;
    expect(sessionStorage.getItem(FORM_STATUS_BDD)).to.be.null;
    expect(sessionStorage.getItem(SAVED_SEPARATION_DATE)).to.be.null;
    tree.unmount();
  });

  describe('new confirmation page (toggle enabled)', () => {
    // new confirmation page toggle on

    /**
     * Utility to verify confirmation page
     * @param {string} claimId - if claimId has a value, verify the label and value are on the page
     * @param {boolean} isBdd - if true, verify BDD alert is present, otherwise verify it is not present
     * @param {string} submissionStatus - used to verify logic based on success or non success status
     */
    const verifyConfirmationPage = (
      claimId,
      isBdd = false,
      submissionStatus,
    ) => {
      const store = mockStore(
        getData({
          disability526NewConfirmationPage: true,
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
      getByText('Unknown Condition');

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
      expect(container.querySelectorAll('va-link')).to.have.lengthOf(5);
      const link = container.querySelectorAll('va-link')[1];
      expect(link.getAttribute('download')).to.exist;
      expect(link.getAttribute('filetype')).to.equal('PDF');
      expect(link.getAttribute('href')).to.equal(
        'https://www.vba.va.gov/pubs/forms/VBA-21-686c-ARE.pdf',
      );
      expect(link.getAttribute('pages')).to.equal('15');
      expect(link.getAttribute('text')).to.equal(
        'Download VA Form 21-686c (opens in new tab)',
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
  });
});
