import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { scrollTo, waitForRenderThenFocus } from 'platform/utilities/ui/';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import { verifyVaFileNumber } from '../actions';
import { IntroductionPageHeader } from '../components/IntroductionPageHeader';
import { IntroductionPageFormProcess } from '../components/IntroductionPageFormProcess';
import {
  VerifiedAlert,
  VaFileNumberMissingAlert,
  ServerErrorAlert,
} from '../config/helpers';
import { V2_LAUNCH_DATE } from '../config/constants';

const IntroductionPage = props => {
  const dispatch = useDispatch();
  const { hasVaFileNumber, isLoading } = useSelector(
    state => state?.vaFileNumber,
  );
  const hasSession = () => JSON.parse(localStorage.getItem('hasSession'));

  useEffect(() => {
    if (hasSession()) {
      dispatch(verifyVaFileNumber());
    }
    waitForRenderThenFocus('.schemaform-title > h1');
    scrollTo('topContentElement');
  }, []);

  const getStatus = () => {
    if (hasVaFileNumber?.errors) return 'error';
    if (!hasVaFileNumber?.VALIDVAFILENUMBER && !isLoading)
      return 'missingVaFileNumber';
    if (isLoading) return 'loading';
    return '';
  };

  const renderLoadingOrError = status => {
    if (status === 'loading') {
      return (
        <va-loading-indicator message="Verifying veteran account information..." />
      );
    }
    if (['error', 'missingVaFileNumber']?.includes(status) && hasSession()) {
      const alertMessage =
        status === 'missingVaFileNumber'
          ? VaFileNumberMissingAlert
          : ServerErrorAlert;

      return (
        <div className="vads-u-margin-y--2">
          <va-alert status="error">{alertMessage}</va-alert>
        </div>
      );
    }
    return null;
  };

  return getStatus() !== '' && hasSession() ? (
    renderLoadingOrError(getStatus())
  ) : (
    <div className="schemaform-intro">
      <IntroductionPageHeader />
      <IntroductionPageFormProcess />
      <SaveInProgressIntro
        {...props}
        hideUnauthedStartLink
        verifiedPrefillAlert={VerifiedAlert}
        prefillEnabled={props.route.formConfig.prefillEnabled}
        messages={props.route.formConfig.savedFormMessages}
        downtime={props.route.formConfig.downtime}
        pageList={props.route.pageList}
        startText="Add or remove a dependent"
        headingLevel={2}
      >
        <p className="vads-u-margin-bottom--4">
          You should also know that we updated our online form.{' '}
          <strong>
            If you started applying online before {V2_LAUNCH_DATE},
          </strong>{' '}
          you’ll need to review the information in your application. Select
          Continue your application to use our updated form.
        </p>
      </SaveInProgressIntro>
      <div className="omb-info--container vads-u-padding-left--0 vads-u-margin-top--2">
        <va-omb-info
          res-burden={30}
          omb-number="2900-0043"
          exp-date="08/31/2025"
        >
          <p>
            <strong>Privacy Act Notice:</strong> VA will not disclose
            information collected on this form to any source other than what has
            been authorized under the Privacy Act of 1974 or Title 38, Code of
            Federal Regulations 1.576 for routine uses (i.e., civil or criminal
            law enforcement, congressional communications, epidemiological or
            research studies, the collection of money owed to the United States,
            litigation in which the United States is a party or has an interest,
            the administration of VA programs and delivery of VA benefits,
            verification of identity and status, and personnel administration)
            as identified in the VA system of records, 58VA21/22/28,
            Compensation, Pension, Education, and Veteran Readiness and
            Employment Records - VA, published in the Federal Register. Your
            obligation to respond is required to obtain or retain benefits.
            Giving us your and your dependents' SSN account information is
            mandatory. Applicants are required to provide their SSN and the SSN
            of any dependents for whom benefits are claimed under Title 38 USC
            5101 (c)(1). The VA will not deny an individual benefits for
            refusing to provide his or her SSN unless the disclosure of the SSN
            is required by Federal Statute of law in effect prior to January 1,
            1975, and still in effect. Information that you furnish may be
            utilized in computer matching programs with other Federal or state
            agencies for the purpose of determining your eligibility to receive
            VA benefits, as well as to collect any amount owed to the United
            States by virtue of your participation in any benefit program
            administered by the Department of Veterans Affairs.
          </p>
          <p>
            <strong>Respondent Burden:</strong> We need this information to
            determine marital status and eligibility for an additional allowance
            for dependents under 38 U.S.C. 1115. Title 38, United States Code,
            allows us to ask for this information. We estimate that you will
            need an average of 30 minutes to review the instructions, find the
            information and complete this form. VA cannot conduct or sponsor a
            collection of information unless a valid OMB control number is
            displayed. You are not required to respond to a collection of
            information if this number is not displayed. Valid OMB control
            numbers can be located on the OMB Internet Page at{' '}
            <a
              href="https://www.reginfo.gov/public/do/PRAMain"
              rel="noopener noreferrer"
              target="_blank"
            >
              www.reginfo.gov/public/do/PRAMain
            </a>
            . If desired, you can call 1-800-827-1000 to get information on
            where to send comments or suggestions about this form.
          </p>
        </va-omb-info>
      </div>
      <h2>Additional forms you may need to complete</h2>
      <h3>Request for Approval of School Attendance</h3>
      <p>VA Form 21-674</p>
      <div className="omb-info--container vads-u-padding-left--0 vads-u-margin-top--2">
        <va-omb-info
          res-burden={15}
          omb-number="2900-0049"
          exp-date="11/30/2027"
        >
          <p>
            <strong>Privacy Act Notice:</strong> VA will not disclose
            information collected on this form to any source other than what has
            been authorized under the Privacy Act of 1974 or Title 38, Code of
            Federal Regulations 1.576 for routine uses (i.e., civil or criminal
            law enforcement, congressional communications, epidemiological or
            research studies, the collection of money owed to the United States,
            litigation in which the United States is a party or has an interest,
            the administration of VA programs and delivery of VA benefits,
            verification of identity and status, and personnel administration)
            as identified in the VA system of records, 58VA21/22/28,
            Compensation, Pension, Education, and Veteran Readiness and
            Employment Records - VA, published in the Federal Register. Your
            obligation to respond is required to obtain or retain benefits. the
            requested information is considered relevant and necessary to
            determine maximum benefits under the law. Giving us your and your
            dependents' SSN account information is mandatory. Applicants are
            required to provide their SSN and the SSN of any dependents for whom
            benefits are claimed under Title 38 U.S.C. 5101(c)(1). VA will not
            deny an individual benefits for refusing to provide their SSN unless
            the disclosure of the SSN is required by a Federal Statute of law in
            effect prior to January 1, 1975, and still in effect. The responses
            you submit are considered confidential (38 U.S.C. 5701). Information
            submitted is subject to verification through computer matching
            programs with other agencies.
          </p>
          <p>
            <strong>Respondent Burden:</strong> An agency may not conduct or
            sponsor, and a person is not required to respond to, a collection of
            information unless it displays a currently valid OMB control number.
            The OMB control number for this project is 2900-0049, and it expires
            November 30, 2027. Public reporting burden for this collection of
            information is estimated to average 15 minutes per respondent, per
            year, including the time for reviewing instructions, searching
            existing data sources, gathering and maintaining the data needed,
            and completing and reviewing the collection of information. Send
            comments regarding this burden estimate and any other aspect of this
            collection of information, including suggestions for reducing the
            burden, to VA Reports Clearance Officer at{' '}
            <va-link
              href="mailto:VACOPaperworkReduAct@va.gov"
              text="VACOPaperworkReduAct@va.gov"
            />
            . Please refer to OMB Control No. 2900-0049 in any correspondence.
            Do not send your completed VA Form 21-674 to this email address.
          </p>
        </va-omb-info>
      </div>
    </div>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.object,
      downtime: PropTypes.object,
    }),
    pageList: PropTypes.array,
  }).isRequired,
};

export default IntroductionPage;
