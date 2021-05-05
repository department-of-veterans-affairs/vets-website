import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';
import { links } from 'applications/caregivers/definitions/content';
import { withRouter } from 'react-router';
import { CaregiverSupportInfo } from 'applications/caregivers/components/AdditionalInfo';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { setData } from 'platform/forms-system/src/js/actions';

const IntroductionPage = ({
  route,
  router,
  formData,
  setFormData,
  canUpload1010cgPOA,
}) => {
  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  const getFeatureFlip = useCallback(
    () => {
      setFormData({
        ...formData,
        'view:canUpload1010cgPOA': canUpload1010cgPOA,
      });
    },
    [setFormData, canUpload1010cgPOA],
  );

  useEffect(
    () => {
      getFeatureFlip();
    },
    [getFeatureFlip],
  );

  const startForm = () => {
    recordEvent({ event: 'caregivers-10-10cg-start-form' });
    const pageList = route.pageList;
    return router.push(pageList[1].path);
  };

  const ProcessTimeline = () => (
    <div>
      <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--2p5">
        Follow the steps below to apply for the Program of Comprehensive
        Assistance for Family Caregivers:
      </h2>

      <div className="process schemaform-process">
        <ol>
          {/* Prepare */}
          <li className="process-step list-one">
            <h3 className="vads-u-font-size--h4">Prepare</h3>

            <p>
              To fill out this application, the Veteran and each family
              caregiver applicant will need to provide specific information.
              You’ll need:
            </p>

            <ul className="process-lists">
              <li>
                The address, telephone number, and date of birth for the Veteran
                and each family caregiver applicant
              </li>
              <li>The VA medical center where the Veteran will receive care</li>
              <li>
                Health insurance information for the Primary Family Caregiver
              </li>

              <li className="call-to-action-bullet">
                The Veteran&apos;s Social Security number or tax identification
                number (This is required for the online application only.) If
                you’d like to apply without providing this information, you can
                download the paper form
                <p className="vads-u-margin-top--2">
                  <a
                    href="https://www.va.gov/vaforms/medical/pdf/10-10CG.pdf"
                    download="10-10CG.pdf"
                    type="application/pdf"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i
                      aria-hidden="true"
                      className="fas fa-download vads-u-padding-right--1"
                      role="img"
                    />
                    Download VA form 10-10CG
                    <dfn className="vads-u-margin-left--0p5">
                      <abbr title="Portable Document Format">(PDF)</abbr> (934
                      <abbr title="Kilobytes">KB</abbr>)
                    </dfn>
                  </a>
                </p>
              </li>
            </ul>

            <div>
              <h4 className="vads-u-font-size--h6">
                What if I have questions or need help filling out the form?
              </h4>

              <span>
                If you have a question or need help, you can contact us in any
                of these ways:
              </span>

              <ul className="process-lists">
                <li>
                  Call us at
                  <Telephone
                    contact={CONTACTS.HEALTHCARE_ELIGIBILITY_CENTER}
                    className="vads-u-margin-x--0p5"
                  />
                  and ask for help filling out the form
                </li>
                <li>
                  Use the online
                  <a
                    href={links.caregiverSupportCoordinators.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vads-u-margin-x--0p5"
                  >
                    Caregiver Support Coordinator locator
                  </a>
                  to find a coordinator at your nearest VA health care facility
                </li>
                <li>
                  Contact the VA National Caregiver Support Line by calling
                  <Telephone
                    className="vads-u-margin-x--0p5"
                    contact={CONTACTS.CAREGIVER}
                  />
                </li>
              </ul>

              <CaregiverSupportInfo />
            </div>
          </li>

          {/* Apply */}
          <li className="process-step list-two">
            <h3 className="vads-u-font-size--h4">Apply</h3>
            <p>
              Please remember, whether you’re the Veteran or a family caregiver,
              you’ll need to complete all form questions before submitting the
              form. After submitting the form, you’ll receive a confirmation
              screen that you can print for your records.
            </p>

            <p>
              Each time the Veteran wants to add a new family caregiver, the
              Veteran and the new caregiver will need to submit a new
              application. There can only be 1 Primary and up to 2 Secondary
              Family Caregivers at any one time.
            </p>

            <p>
              <strong>Note:</strong> If the Veteran isn’t enrolled in VA health
              care or is currently on active duty with a medical discharge,
              they’ll need to fill out an
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={links.applyVAHealthCare.link}
                className="vads-u-margin-x--0p5"
              >
                {links.applyVAHealthCare.label}
              </a>
              (VA Form 10-10EZ).
            </p>
          </li>

          {/* Next steps */}
          <li className="process-step list-three">
            <h3 className="vads-u-font-size--h4">Next steps</h3>
            <p>
              A member of the Caregiver Support Program at the VA medical center
              where the Veteran plans to receive care will contact you to
              discuss your application and eligibility.
            </p>

            <p>
              If you aren’t eligible for PCAFC you have the right to appeal. You
              can contact the patient advocate at your local VA medical center
              to discuss the appeal process. Your Caregiver Support Coordinator
              is also available if you have additional questions.
            </p>

            <p>
              You may also be eligible for the Program of General Caregiver
              Support Services (PGCSS). To find out more, call the VA Caregiver
              Support Line at
              <Telephone
                contact={CONTACTS.CAREGIVER}
                className="vads-u-margin-left--0p5"
              />
              , visit
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={links.caregiverHelpPage.link}
                className="vads-u-margin-left--0p5"
              >
                www.caregiver.va.gov
              </a>
              , or discuss your options with your local Caregiver Support
              Coordinator.
            </p>
          </li>
        </ol>
      </div>
    </div>
  );

  return (
    <div className="caregivers-intro schemaform-intro">
      <DowntimeNotification
        appTitle="Application for the Program of Comprehensive Assistance for Family Caregivers"
        dependencies={[externalServices.mvi, externalServices.carma]}
      >
        <FormTitle
          className="form-title"
          title="Apply for the Program of Comprehensive Assistance for Family Caregivers"
        />

        <p>
          Equal to VA Form 10-10CG (Application for Family Caregiver Benefits)
        </p>
        <p className="va-introtext">
          We recognize the important role of family caregivers in supporting the
          health and wellness of Veterans.
        </p>

        <button
          style={{ display: 'inherit ' }}
          className="usa-button vads-u-margin-y--3"
          onClick={startForm}
        >
          Start your application
        </button>
        <ProcessTimeline />
        <button
          className="usa-button vads-u-margin-bottom--3"
          onClick={startForm}
        >
          Start your application
        </button>
        <div className="omb-info--container vads-u-padding-left--0">
          <OMBInfo resBurden={15} ombNumber="2900-0768" expDate="09/30/2021" />
        </div>
      </DowntimeNotification>
    </div>
  );
};

const mapStateToProps = state => ({
  formData: state.form.data,
  canUpload1010cgPOA: toggleValues(state)[
    FEATURE_FLAG_NAMES.canUpload1010cgPOA
  ],
});

const mapDispatchToProps = {
  setFormData: setData,
};

IntroductionPage.propTypes = {
  canUpload1010cgPOA: PropTypes.bool,
  setFormData: PropTypes.func,
  formData: PropTypes.object,
};

const introPageWithRouter = withRouter(IntroductionPage);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(introPageWithRouter);
