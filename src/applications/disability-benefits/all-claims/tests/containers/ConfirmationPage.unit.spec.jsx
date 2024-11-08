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
    it('should render new confirmation page when submission succeeded with claim id', () => {
      const store = mockStore(
        getData({
          disability526NewConfirmationPage: true,
        }),
      );
      const props = {
        ...defaultProps,
        claimId: '123456789',
        submissionStatus: submissionStatuses.succeeded,
      };

      const { container, getByText } = render(
        <Provider store={store}>
          <ConfirmationPage {...props} />
        </Provider>,
      );

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
      getByText('Claim ID number');
      getByText(props.claimId);

      // rest of sections are present
      getByText('Print this confirmation page');
      getByText('What to expect');
      getByText('How to contact us if you have questions');
      getByText('How long will it take VA to make a decision on my claim?');
      getByText('If I have dependents, how can I receive additional benefits?');
      getByText('Need help?');
      expect(container.querySelectorAll('va-link')).to.have.lengthOf(5);
    });
  });
});
