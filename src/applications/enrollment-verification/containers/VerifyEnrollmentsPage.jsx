/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';

import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';

import {
  fetchVerificationStatus,
  VERIFICATION_STATUS_CORRECT,
  VERIFICATION_STATUS_INCORRECT,
} from '../actions';
import EnrollmentVerificationLoadingIndicator from '../components/EnrollmentVerificationLoadingIndicator';
import EnrollmentVerificationPageWrapper from '../components/EnrollmentVerificationPageWrapper';
import ReviewEnrollmentVerifications from '../components/ReviewEnrollmentVerifications';
import MonthReviewCard from '../components/MonthReviewCard';

export class VerifyEnrollmentsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      continueClicked: false,
      currentMonth: 0,
      informationIncorrectMonth: undefined,
      monthInformationCorrect: undefined,
      unverifiedMonths: undefined,
    };
  }

  componentDidMount() {
    const {
      getVerificationStatus,
      hasCheckedKeepAlive,
      loggedIn,
      verificationStatus,
    } = this.props;
    if (hasCheckedKeepAlive && !loggedIn) {
      window.location.href = '/enrollment-history/';
    }

    if (!verificationStatus) {
      getVerificationStatus();
    }
  }

  // TODO
  // if (!unverifiedMonths || !unverifiedMonths.length) {
  // window.location.html = '';
  // }

  onEditMonth = m => {
    const { unverifiedMonths } = this.state;

    window.console.log('edit month');
    const cm = unverifiedMonths.findIndex(um => um.month === m.month);
    this.setState({ currentMonth: cm });
  };

  updateMonthInformationCorrect = event => {
    this.setState({
      continueClicked: false,
      monthInformationCorrect: event.value,
    });
  };

  onBackButtonClick = () => {
    const { currentMonth } = this.state;

    if (currentMonth === 0) {
      window.location.href = '/enrollment-history/review-enrollments';
    }
  };

  onForwardButtonClick = () => {
    const {
      monthInformationCorrect,
      unverifiedMonths,
      currentMonth,
    } = this.state;

    if (!monthInformationCorrect) {
      this.setState({ continueClicked: true });
      return;
    }

    this.setState({
      unverifiedMonths: unverifiedMonths.map(
        (m, i) =>
          i === currentMonth
            ? {
                ...m,
                verificationStatus: monthInformationCorrect,
              }
            : m,
      ),
    });

    if (monthInformationCorrect === VERIFICATION_STATUS_INCORRECT) {
      this.setState({
        informationIncorrectMonth: unverifiedMonths[currentMonth].month,
      });
    }

    this.setState({
      currentMonth: currentMonth + 1,
      monthInformationCorrect: undefined,
    });

    // if () {
    //   window.location.href = '/enrollment-history/review-enrollments';
    // }
  };

  render() {
    const {
      editMonthVerification,
      // getVerificationStatus,
      // hasCheckedKeepAlive,
      // loggedIn,
      verificationStatus,
    } = this.props;

    const {
      continueClicked,
      currentMonth,
      informationIncorrectMonth,
      monthInformationCorrect,
      unverifiedMonths,
    } = this.state;

    let month;

    if (unverifiedMonths) {
      const editMonthIndex = editMonthVerification
        ? unverifiedMonths.findIndex(
            m => m.month === editMonthVerification.month,
          )
        : -1;

      month =
        editMonthIndex > -1
          ? unverifiedMonths[editMonthIndex]
          : unverifiedMonths[currentMonth];
    } else if (verificationStatus?.months?.length && !unverifiedMonths) {
      const _unverifiedMonths = verificationStatus.months
        .filter(m => !m.verified)
        .reverse();

      const _informationIncorrectMonth = _unverifiedMonths.find(
        m => m.verificationStatus === VERIFICATION_STATUS_INCORRECT,
      );

      let firstUnverifiedMonthIndex;
      if (!_informationIncorrectMonth) {
        firstUnverifiedMonthIndex = _unverifiedMonths.findIndex(
          m => !m.verified,
        );
        month = _unverifiedMonths[firstUnverifiedMonthIndex];
      }

      this.setState({
        currentMonth: firstUnverifiedMonthIndex || currentMonth,
        unverifiedMonths: _unverifiedMonths,
        informationIncorrectMonth: _informationIncorrectMonth,
      });
    }

    if (!verificationStatus || !unverifiedMonths) {
      return <EnrollmentVerificationLoadingIndicator />;
    }

    if (informationIncorrectMonth || currentMonth === unverifiedMonths.length) {
      return (
        <EnrollmentVerificationPageWrapper>
          <h1>Verify your enrollments</h1>

          <va-segmented-progress-bar
            current={currentMonth + 1}
            total={unverifiedMonths.length + 1}
          />

          <h2>
            Step {currentMonth + 1} of {unverifiedMonths.length + 1}: Review
            verifications
          </h2>

          <ReviewEnrollmentVerifications
            months={unverifiedMonths}
            informationIncorrectMonth={informationIncorrectMonth}
            onEditMonth={this.onEditMonth}
          />
        </EnrollmentVerificationPageWrapper>
      );
    }

    return (
      <EnrollmentVerificationPageWrapper>
        <h1>Verify your enrollments</h1>

        <va-segmented-progress-bar
          current={currentMonth + 1}
          total={unverifiedMonths.length + 1}
        />

        <h2>
          Step {currentMonth + 1} of {unverifiedMonths.length + 1}: Verify{' '}
          {month.month}
        </h2>

        {/* <va-alert
          background-only
          close-btn-aria-label="Close notification"
          status="info"
          visible
        >
          We skipped you ahead to the review step because you selected "No, this
          information isn’t correct" for September 2021.
        </va-alert> */}
        {/* 
        <br />

        <va-alert
          background-only
          close-btn-aria-label="Close notification"
          show-icon
          status="warning"
          visible
        >
          <va-additional-info trigger="If you submit this verification, we'll pause your monthly education payments">
            <p>
              If you submit this verification, we will pause your monthly payments
              until your enrollment information is corrected.
            </p>
            <p>
              You can update your enrollment information before you submit your
              verification:
            </p>
            <ul>
              <li>
                Work with your School Certifying Official (SCO) to make sure they
                have the correct enrollment information and can update the
                information on file.
              </li>
              <li>
                After your information is corrected, verify the corrected
                information.
              </li>
            </ul>
          </va-additional-info>
        </va-alert> */}

        <br />

        <MonthReviewCard month={month} />

        <RadioButtons
          errorMessage={continueClicked ? 'Please select an option' : ''}
          label="To the best of your knowledge, is this enrollment information correct?"
          // onKeyDown={function noRefCheck() {}}
          // onMouseDown={function noRefCheck() {}}
          onValueChange={this.updateMonthInformationCorrect}
          options={[
            {
              value: VERIFICATION_STATUS_CORRECT,
              label: 'Yes, this information is correct',
            },
            {
              value: VERIFICATION_STATUS_INCORRECT,
              label: "No, this information isn't correct",
            },
          ]}
          required
          value={{ value: monthInformationCorrect }}
        />

        <va-alert
          close-btn-aria-label="Close notification"
          status="warning"
          visible
        >
          If you select, "No this information isn’t correct,"{' '}
          <strong>
            we’ll pause your monthly payments until you update your enrollment
            information.
          </strong>{' '}
          You also won’t be able to verify any future enrollments until you
          update your information.
        </va-alert>

        <button
          type="button"
          className="usa-button-secondary"
          id="1-continueButton"
          onClick={this.onBackButtonClick}
        >
          <span className="button-icon" aria-hidden="true">
            «&nbsp;
          </span>
          Back
        </button>
        <button
          type="submit"
          className="usa-button-primary"
          id="2-continueButton"
          onClick={this.onForwardButtonClick}
        >
          Continue
          <span className="button-icon" aria-hidden="true">
            &nbsp;»
          </span>
        </button>
      </EnrollmentVerificationPageWrapper>
    );
  }
}

const mapStateToProps = state => ({
  editMonthVerification: state?.data?.editMonthVerification,
  hasCheckedKeepAlive: state?.user?.login?.hasCheckedKeepAlive || false,
  loggedIn: state?.user?.login?.currentlyLoggedIn || false,
  verificationStatus: state?.data?.verificationStatus,
});

const mapDispatchToProps = {
  getVerificationStatus: fetchVerificationStatus,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VerifyEnrollmentsPage);
