import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

const App = ({ formEnabled }) => {
  if (formEnabled === undefined) {
    return <va-loading-indicator message="Loading..." />;
  }

  if (formEnabled) {
    return (
      <>
        <p>You can apply for a PMC in any of these 5 ways.</p>
        <h3>Option 1: Apply online</h3>
        <a
          className="vads-c-action-link--green"
          href="/burials-memorials/memorial-items/presidential-memorial-certificates/request-certificate-form-40-0247"
        >
          Apply for a PMC online
        </a>
        <h3>Option 2: Mail your application</h3>
        <p>
          First, complete the Presidential Memorial Certificate Request Form (VA
          Form 40-0247).
        </p>
        <p>
          <va-link
            href="/find-forms/about-form-40-0247"
            text="Get VA Form 40-0247 to download"
          />
        </p>
        <p>
          Mail your application, along with copies of the Veteran’s death
          certificate and DD214 or other discharge documents, to this address:
        </p>
        <p className="va-address-block">
          NCA FP Evidence Intake Center
          <br />
          PO Box 5237
          <br />
          Janesville, WI 53547
        </p>
        <p>
          <strong>Note</strong>: Please don’t send original documents since we
          can’t return them to you.
        </p>
        <p>
          <va-link
            href="https://www.cem.va.gov/CEM/hmm/discharge_documents.asp"
            text="Review our list of military discharge documents"
          />
        </p>
        <h3>Option 3: Upload your application</h3>
        <p>
          First, complete the Presidential Memorial Certificate Request Form (VA
          Form 40-0247).
        </p>
        <p>
          <va-link
            href="/find-forms/about-form-40-0247"
            text="Get VA Form 40-0247 to download"
          />
        </p>
        <p>
          Then, upload your completed application and supporting documents on
          the AccessVA website using the QuickSubmit tool.
        </p>
        <p>
          If it’s your first time signing in to this tool, you’ll need to
          register first. After you’ve registered, you can upload your
          application and documents online.
        </p>
        <p>
          <va-link
            href="https://eauth.va.gov/accessva/?cspSelectFor=quicksubmit"
            text="Upload your application on AccessVA"
          />
        </p>
        <h3>Option 4: Submit your application in person</h3>
        <p>You can apply at any VA regional office.</p>
        <p>
          <va-link
            href="/find-locations/?facilityType=benefits"
            text="Find your nearest VA regional office"
          />
        </p>
        <h3>Option 5: Fax your application</h3>
      </>
    );
  }

  return (
    <>
      <p>You can apply for a PMC in any of these 4 ways.</p>
      <h3>Option 1: Upload your application</h3>
      <p>
        First, complete the Presidential Memorial Certificate Request Form (VA
        Form 40-0247).
      </p>
      <p>
        <va-link
          href="/find-forms/about-form-40-0247"
          text="Get VA Form 40-0247 to download"
        />
      </p>
      <p>
        Then, upload your completed application and supporting documents on the
        AccessVA website using the QuickSubmit tool.
      </p>
      <p>
        If it’s your first time signing in to this tool, you’ll need to register
        first. After you’ve registered, you can upload your application and
        documents online.
      </p>
      <p>
        <va-link
          href="https://eauth.va.gov/accessva/?cspSelectFor=quicksubmit"
          text="Upload your application on AccessVA"
        />
      </p>
      <h3>Option 2: Mail your application</h3>
      <p>
        First, complete the Presidential Memorial Certificate Request Form (VA
        Form 40-0247).
      </p>
      <p>
        <va-link
          href="/find-forms/about-form-40-0247"
          text="Get VA Form 40-0247 to download"
        />
      </p>
      <p>
        Mail your application, along with copies of the Veteran’s death
        certificate and DD214 or other discharge documents, to this address:
      </p>
      <p className="va-address-block">
        NCA FP Evidence Intake Center
        <br />
        PO Box 5237
        <br />
        Janesville, WI 53547
      </p>
      <p>
        <strong>Note</strong>: Please don’t send original documents since we
        can’t return them to you.
      </p>
      <p>
        <va-link
          href="https://www.cem.va.gov/CEM/hmm/discharge_documents.asp"
          text="Review our list of military discharge documents"
        />
      </p>
      <h3>Option 3: Submit your application in person</h3>
      <p>You can apply at any VA regional office.</p>
      <p>
        <va-link
          href="/find-locations/?facilityType=benefits"
          text="Find your nearest VA regional office"
        />
      </p>
      <h3>Option 4: Fax your application</h3>
    </>
  );
};

App.propTypes = {
  formEnabled: PropTypes.bool,
};

const mapStateToProps = store => ({
  formEnabled: toggleValues(store)[FEATURE_FLAG_NAMES.form400247],
});

export default connect(mapStateToProps)(App);
