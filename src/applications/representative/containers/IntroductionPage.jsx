import React from 'react';
import PropTypes from 'prop-types';

// SaveInProgressIntro is missing from babel.config.json
// eslint-disable-next-line @department-of-veterans-affairs/use-workspace-imports
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
// eslint-disable-next-line import/no-cycle
import formConfig from '../config/form';
import RepCard from '../components/RepCard';

const IntroductionPage = props => {
  const selectedRepresentative = {
    id: 12345,
    name: 'Veterans of Foreign Wars (033)',
    type: 'Veteran Service Organization (VSO)',
    address: '123 Main Street',
    city: 'Montgomery',
    state: 'Alabama',
    postalCode: '36102-1509',
    phone: '205-932-6262',
  };

  return (
    <>
      <div className="schemaform-title">
        <h1 data-testid="form-title">Appoint a Representative</h1>
        <div className="schemaform-subtitle" data-testid="form-subtitle">
          Selected Representative
        </div>
      </div>
      <div className="schemaform-intro">
        <RepCard selectedRepresentative={selectedRepresentative} />
        <va-alert status="warning" class="vads-u-margin-bottom--4">
          <h3 slot="headline">Before you continue</h3>
          <div>
            <p>
              Keep in mind, appointing this representative will replace your
              current representative.
            </p>
          </div>
        </va-alert>
        <va-alert
          close-btn-aria-label="Close notification"
          status="info"
          class="vads-u-margin-bottom--4"
          visible
        >
          <h2 id="track-your-status-on-mobile" slot="headline">
            Sign in to see your current representative
          </h2>
          <div>
            <SaveInProgressIntro
              buttonOnly
              unauthStartText="Sign in"
              prefillEnabled={formConfig.prefillEnabled}
              messages={formConfig.savedFormMessages}
              formConfig={formConfig}
              pageList={props.route.pageList}
              downtime={formConfig.downtime}
            />
          </div>
        </va-alert>
        <SaveInProgressIntro
          startText="Sign in to see your current representative."
          unauthStartText="Sign in"
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          formConfig={formConfig}
          pageList={props.route.pageList}
          downtime={formConfig.downtime}
        />
        <h2>What can I expect next?</h2>
        <ol>
          <li>
            Pre-fill the Appointment of Representative VA Form 21-22 online
            using the following steps, or download and fill out the form.
          </li>
          <li>Print and sign your completed form.</li>
          <li>
            Have your representative sign the form either through mail using the
            address above or in person.
          </li>
          <li>
            You or your representative can submit the form online, by mail, or
            in person at a VA regional office.
          </li>
        </ol>
        <p>
          Where can I submit my completed Appointment of Representative VA Form
          21-22?
        </p>
        <ul>
          <li>Online</li>
          <li>Upload to VA.gov Claim Status Tool</li>
          <li>Or upload to Access VA Quick Submit Tool</li>
        </ul>
        <p>
          <strong>By Mail</strong>
          <br />
          Compensation Claims Department of Veterans Affairs Evidence Intake
          <br />
          Center PO Box 4444 Janesville, WI 53547-4444
        </p>
        <p>
          <strong>Board of Veterans' Appeals</strong>
          <br />
          Department of Veterans Affairs Board of Veterans' Appeals PO Box 27063
          <br />
          Washington, DC 20038
        </p>
        <p>
          <strong>Fiduciary</strong>
          <br />
          Department of Veterans Affairs Fiduciary Intake PO Box 95211 Lakeland,
          <br />
          FL 33804-5211
        </p>
        <p>
          <strong>Pension & Survivors Benefit Claims</strong>
          <br />
          Department of Veterans Affairs Pension Intake Center PO Box 5365
          <br />
          Janesville, WI 53547-5365
        </p>
        <p>
          <strong>In Person</strong>
        </p>
        <ul>
          <li>Find a VA regional office near you</li>
        </ul>
      </div>
    </>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.object,
};

export default IntroductionPage;
