import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';
import { links } from 'applications/caregivers/definitions/content';
import { withRouter } from 'react-router';
import {
  CaregiverSupportInfo,
  CaregiversPrivacyActStatement,
} from 'applications/caregivers/components/AdditionalInfo';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { setData } from 'platform/forms-system/src/js/actions';

export const IntroductionPage = ({
  route,
  router,
  formData,
  setFormData,
  canAutofill1010cgAddress,
  canUpload1010cgPOA,
}) => {
  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  useEffect(
    () => {
      setFormData({
        ...formData,
        'view:canUpload1010cgPOA': canUpload1010cgPOA,
        'view:canAutofill1010cgAddress': canAutofill1010cgAddress,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setFormData, canAutofill1010cgAddress, canUpload1010cgPOA],
  );

  const startForm = useCallback(
    () => {
      recordEvent({ event: 'caregivers-10-10cg-start-form' });
      const { pageList } = route;
      return router.push(pageList[1].path);
    },
    [route, router],
  );

  const ProcessTimeline = () => (
    <div>
      <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--2p5">
        Follow these steps to get started:
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

            <div>
              <ul className="process-lists">
                <li>
                  The address, telephone number, and date of birth for the
                  Veteran and each family caregiver applicant
                </li>
                <li>
                  The VA medical center where the Veteran will receive care
                </li>
                <li>
                  Health insurance information for the Primary Family Caregiver
                </li>
                <li>
                  Veteran’s Social Security number (SSN) or tax identification
                  number (TIN)
                </li>
              </ul>
              <div className="vads-u-margin-top--2 vads-u-margin-bottom--5">
                <va-additional-info trigger="What if I don't want to put my SSN or TIN in the application?">
                  <div className="vads-u-padding-y--0p25">
                    <p>
                      We only require your SSN or TIN if you apply online. If
                      you want to apply without putting this information in your
                      application, you can apply by mail or in person.
                    </p>
                    <p>
                      <a href="/family-member-benefits/comprehensive-assistance-for-family-caregivers/#how-do-i-apply-for-this-progra">
                        Get instructions for how to apply for the PCAFC program
                        by mail or in person
                      </a>
                    </p>
                  </div>
                </va-additional-info>
              </div>
              {canUpload1010cgPOA && (
                <p
                  data-testid="poa-info-note"
                  className="vads-u-margin-bottom--4"
                >
                  {' '}
                  <strong>Note:</strong> If you’re a legal representative who
                  can make medical decisions for the Veteran, you can sign this
                  application for them. You’ll need to upload proof of your
                  legal authority to make medical decisions for the Veteran.
                  This type of document is sometimes called a medical proxy or
                  medical power of attorney.
                </p>
              )}
            </div>

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
                  Call us at{' '}
                  <va-telephone
                    contact={CONTACTS.HEALTHCARE_ELIGIBILITY_CENTER}
                  />{' '}
                  and ask for help filling out the form
                </li>
                <li>
                  Use the online{' '}
                  <a
                    href={links.caregiverSupportCoordinators.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Caregiver Support Coordinator locator
                  </a>{' '}
                  to find a coordinator at your nearest VA health care facility
                </li>
                <li>
                  Contact the VA National Caregiver Support Line by calling{' '}
                  <va-telephone contact={CONTACTS.CAREGIVER} />
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
              they’ll need to fill out an{' '}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={links.applyVAHealthCare.link}
              >
                {links.applyVAHealthCare.label}
              </a>{' '}
              (VA Form 10-10EZ).
            </p>
          </li>

          {/* Next steps */}
          <li className="process-step list-three vads-u-padding-bottom--0">
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
              Support Line at <va-telephone contact={CONTACTS.CAREGIVER} />,
              visit{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={links.caregiverHelpPage.link}
              >
                {links.caregiverHelpPage.label}
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

        <a
          className="vads-c-action-link--green"
          href="#start"
          onClick={startForm}
        >
          Start your application
        </a>

        <ProcessTimeline />

        <a
          className="vads-c-action-link--green"
          href="#start"
          onClick={startForm}
        >
          Start your application
        </a>

        <div className="omb-info--container vads-u-padding-left--0  vads-u-margin-top--4">
          <OMBInfo resBurden={15} ombNumber="2900-0768" expDate="04/30/2024">
            <CaregiversPrivacyActStatement />
          </OMBInfo>
        </div>
      </DowntimeNotification>
    </div>
  );
};

const mapStateToProps = state => ({
  formData: state.form.data,
  canAutofill1010cgAddress: state.featureToggles?.canAutofill1010cgAddress,
  canUpload1010cgPOA: state.featureToggles?.canUpload1010cgPOA,
});

const mapDispatchToProps = {
  setFormData: setData,
};

IntroductionPage.propTypes = {
  canAutofill1010cgAddress: PropTypes.bool,
  canUpload1010cgPOA: PropTypes.bool,
  formData: PropTypes.object,
  route: PropTypes.object,
  router: PropTypes.object,
  setFormData: PropTypes.func,
};

const introPageWithRouter = withRouter(IntroductionPage);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(introPageWithRouter);
