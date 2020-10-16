import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// import { focusElement } from 'platform/utilities/ui';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { getEligiblePages } from 'platform/forms-system/src/js/routing';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

const IntroductionPage = props => {
  const [pageList, setPageList] = useState([]);
  useEffect(
    () => {
      const getPageList = () => {
        return getEligiblePages(
          props.route.pageList,
          props.form.data,
          '/introduction',
        );
      };
      setPageList(getPageList());
    },
    [props.form.data, props.route.pageList],
  );

  return (
    <div className="schemaform-intro">
      <FormTitle title="Apply for Veteran Readiness and Employment" />
      <p>
        Equal to VA Form 21-1900 (28-1900 Veteran Readiness and Employment).
      </p>
      {pageList.length < 1 ? (
        <LoadingIndicator message="Checking status..." />
      ) : (
        <SaveInProgressIntro
          prefillEnabled={props.route.formConfig.prefillEnabled}
          messages={props.route.formConfig.savedFormMessages}
          pageList={pageList?.pages}
          startText="Start the Application"
        >
          Please complete the 21-1900 form to apply for Vocational
          Rehabilitation.
        </SaveInProgressIntro>
      )}
      <h4>
        Follow the steps below to apply for Veteran Readiness and Employment.
      </h4>
      <div className="process schemaform-process">
        <ol>
          <li className="process-step list-one">
            <h5>Prepare</h5>
            <h6>To fill out this application, you’ll need your:</h6>
            <ul>
              <li>Social Security number (required)</li>
            </ul>
            <p>
              <strong>What if I need help filling out my application?</strong>{' '}
              An accredited representative, like a Veterans Service Officer
              (VSO), can help you fill out your claim.{' '}
              <a href="/disability-benefits/apply/help/index.html">
                Get help filing your claim
              </a>
            </p>
          </li>
          <li className="process-step list-two">
            <h5>Apply</h5>
            <p>Complete this Veteran Readiness and Employment form.</p>
            <p>
              After submitting the form, you’ll get a confirmation message. You
              can print this for your records.
            </p>
          </li>
          <li className="process-step list-three">
            <h5>VA Review</h5>
            <p>
              We process claims within a week. If more than a week has passed
              since you submitted your application and you haven’t heard back,
              please don’t apply again. Call us at.
            </p>
          </li>
          <li className="process-step list-four">
            <h5>Decision</h5>
            <p>
              Once we’ve processed your claim, you’ll get a notice in the mail
              with our decision.
            </p>
          </li>
        </ol>
      </div>
      {pageList.length < 1 ? (
        <LoadingIndicator message="Checking status..." />
      ) : (
        <SaveInProgressIntro
          prefillEnabled={props.route.formConfig.prefillEnabled}
          messages={props.route.formConfig.savedFormMessages}
          pageList={pageList?.pages}
          startText="Start the Application"
        />
      )}
      <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
        <OMBInfo resBurden={30} ombNumber="21-1900" expDate="12/31/2021" />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  isLoggedIn: state?.user?.login?.currentlyLoggedIn,
  form: state?.form,
});

export default connect(mapStateToProps)(IntroductionPage);
