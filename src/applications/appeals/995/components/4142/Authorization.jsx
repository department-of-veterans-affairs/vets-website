import React, { useState, useEffect } from 'react';
import {
  VaCheckbox,
  VaModal,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { scrollTo } from 'platform/utilities/scroll';
import {
  focusElement,
  waitForRenderThenFocus,
} from 'platform/utilities/ui/focus';
import recordEvent from 'platform/monitoring/record-event';
import { title4142 } from '../../content/title';
import { AUTHORIZATION_LABEL } from '../../constants';
import AuthorizationAlert from './AuthorizationAlert';
import { customPageProps995 } from '../../../shared/props';
import { PrivacyActStatementContent } from './PrivacyActStatementContent';

const Authorization = ({
  data = {},
  goBack,
  goForward,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const [hasError, setHasError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const toggle4142PrivacyModal = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(
    () => {
      if (hasError) {
        recordEvent({
          event: 'visible-alert-box',
          'alert-box-type': 'warning',
          'alert-box-heading':
            'Authorize your providers to release your records or upload them yourself',
          'error-key': 'not_authorizing_records_release',
          'alert-box-full-width': false,
          'alert-box-background-only': false,
          'alert-box-closeable': false,
          'reason-for-alert': 'Not authorizing records release',
        });
      }
    },
    [hasError],
  );

  const focusOnAlert = () => {
    scrollTo('topScrollElement');
    waitForRenderThenFocus('va-alert h3');
  };

  const handlers = {
    onSubmit: event => {
      // This prevents this nested form submit event from passing to the
      // outer form and causing a page advance
      event.stopPropagation();
    },
    onAnchorClick: () => {
      const checkbox = $('va-checkbox');
      scrollTo(checkbox);
      waitForRenderThenFocus('input', checkbox.shadowRoot);
    },
    onChange: event => {
      const { checked } = event.target;
      setFormData({ ...data, privacyAgreementAccepted: checked });
      setHasError(!checked);
      if (!checked) {
        focusOnAlert();
      }
    },
    onGoForward: () => {
      // Required checkbox
      if (data.privacyAgreementAccepted) {
        setHasError(false);
        goForward(data);
      } else {
        setHasError(true);
        focusOnAlert();
      }
    },
  };

  const focusSection = (_, element) => {
    const focusedElement = document.querySelector(element);

    focusElement(element);

    if (focusedElement.getAttribute('open') === 'false') {
      focusedElement.setAttribute('open', 'true');
    }
  };

  const privacyModalButton = (
    <va-button
      onClick={toggle4142PrivacyModal}
      secondary
      text="Review Privacy Act Statement"
    />
  );

  return (
    <>
      <form onSubmit={handlers.onSubmit}>
        {hasError && (
          <AuthorizationAlert
            hasError={hasError}
            onAnchorClick={handlers.onAnchorClick}
          />
        )}
        <h3>{title4142}</h3>
        <p>
          Only provide this authorization if you want The Department of Veterans
          Affairs (VA) to obtain non-VA medical records on your behalf. If
          you’ve already provided these records or intend to get them yourself,
          there’s no need to fill out this authorization. Doing so will lengthen
          your claim processing time.
        </p>
        <va-accordion>
          <va-accordion-item
            header="1. Expiration and how to cancel authorization"
            id="section-one"
            level="4"
            open
          >
            <p className="vads-u-margin-top--0">
              This authorization will automatically expire in 12 months from the
              date you authorize the form.
            </p>
            <p>
              Providing this authorization is voluntary, but if you don’t
              authorize it, or if you revoke it before we receive necessary
              information, it could prevent an accurate or timely decision on
              your claim, and could result in denial or loss of benefits.
            </p>
            <p>
              You may revoke this authorization in writing at any time, except
              to the extent a source of information has already relied on it to
              take an action.
            </p>
            <p>
              To revoke this authorization, you must send a written statement to
              the VA Regional Office handling your claim. Also, send a copy
              directly to any of your sources that you no longer wish to
              disclose information about you. By providing this authorization
              you understand that VA may use information disclosed prior to
              revocation to decide your claim. If you don’t know which VA
              Regional Office is handling your claim, mail your written
              revocation to the Evidence Intake Center:
            </p>
            <p className="va-address-block vads-u-margin-top--3 vads-u-margin-left--2">
              Department of Veterans Affairs
              <br />
              Evidence Intake Center
              <br />
              PO Box 4444
              <br />
              Janesville, WI 53547-4444
            </p>
          </va-accordion-item>
          <va-accordion-item
            header="2. Sources of records"
            id="section-two"
            level="4"
            open
          >
            <ul className="vads-u-margin-top--0">
              <li>
                <strong>ALL</strong> medical sources (hospitals, clinics, labs,
                physicians, psychologists, etc.) including mental health,
                correctional, addiction treatment, and VA health care
                facilities,
              </li>
              <li>Social workers/rehabilitation counselors,</li>
              <li>Consulting examiners used by VA,</li>
              <li>
                Employers, insurance companies, workers' compensation programs,
                and
              </li>
              <li>
                Others who may know about my condition (family, neighbors,
                friends, public officials)
              </li>
            </ul>
            <p>
              You’ll have the option on the next page to limit your
              authorization of types of sources and/or types of information.
            </p>
          </va-accordion-item>
          <va-accordion-item header="3. Costs for records" level="4" open>
            <p className="vads-u-margin-top--0">
              VA won’t pay any fees charged by a custodian (source) to provide
              records requested.
            </p>
          </va-accordion-item>
          <va-accordion-item header="4. Penalties" level="4" open>
            <p className="vads-u-margin-top--0">
              The law provides severe penalties which include fine or
              imprisonment, or both, for the willful submission of any statement
              or evidence of material fact knowing it to be false.
            </p>
          </va-accordion-item>
          <va-accordion-item
            header="5. Validity of electronic records and signatures"
            level="4"
            open
          >
            <p className="vads-u-margin-top--0">
              Under the Government Paperwork Elimination Act (GPEA) (Public Law
              105-277), the Office of Management and Budget (OMB) ensures that
              agencies, when practicable, provide for the option of electronic
              maintenance, submission of disclosure of information and for the
              use and acceptance of electronic signatures. GPEA states that
              electronic records submitted or maintained in accordance with the
              procedures developed by OMB, or electronic signature or other
              forms of electronic authentication used in accordance with such
              procedures, "shall not be denied legal effect, validity, or
              enforceability merely because such records are in electronic form"
              (Public Law 105-277, section 1707).
            </p>
          </va-accordion-item>
          <va-accordion-item
            header="6. Submitting evidence and other mail"
            level="4"
            open
          >
            <p className="vads-u-margin-top--0">
              You’ll have the option to upload documents later in this form. Or,
              you can upload them later on{' '}
              <va-link href="https://www.va.gov" text="VA.gov" />.
            </p>
            <p>
              Documents may be submitted by mail, in person at a VA regional
              office, or electronically. However, VA recommends submitting
              correspondence electronically as this is the fastest method of
              receipt.
            </p>
            <h5>Send by mail</h5>
            <p className="va-address-block vads-u-margin-top--3">
              Department of Veterans Affairs
              <br />
              Evidence Intake Center
              <br />
              PO Box 4444
              <br />
              Janesville, WI 53547-4444
            </p>
            <p className="vads-u-margin-bottom--0">
              This address serves all United States and foreign locations.
            </p>
          </va-accordion-item>
        </va-accordion>
        <div className="hipaa-privacy-agreement vads-u-padding-x--3 vads-u-padding-top--3 vads-u-padding-bottom--2 vads-u-margin-top--3">
          <h3 className="vads-u-margin-top--0" id="acknowledgement">
            Acknowledgement and HIPAA compliance
          </h3>
          <p>
            I hereby authorize the sources listed in{' '}
            <va-link
              href="#section-two"
              onClick={e => focusSection(e, '#section-two')}
              text="Section 2. Sources of records"
            />
            , to release any information that may have been obtained in
            connection with a physical, psychological or psychiatric examination
            or treatment, with the understanding that VA will use this
            information in determining my eligibility to Veterans benefits I
            have claimed. I understand that the source being asked to provide
            the Veterans Benefits Administration with records under this
            authorization may not require me to execute this authorization
            before it provides me with treatment, payment for health care,
            enrollment in a health plan, or eligibility for benefits provided by
            it.
          </p>
          <p className="vads-u-margin-bottom--2">
            I understand that once my source sends this information to VA under
            this authorization, the information will no longer be protected by
            the HIPAA Privacy Rule, but will be protected by the Federal Privacy
            Act, 5 USC 552a, and VA may disclose this information as authorized
            by law.
          </p>
          {privacyModalButton}
          <p>
            I also understand that I may revoke this authorization in writing,
            at any time except to the extent a source of information has already
            relied on it to take an action. To revoke, I must send a written
            statement to the VA Regional Office handling my claim or the Board
            of Veterans' Appeals (if my claim is related to an appeal) and also
            send a copy directly to any of my sources that I no longer wish to
            disclose information about me. I understand that VA may use
            information disclosed prior to revocation to decide my claim.
          </p>
          <p>
            HIPAA NOTE: This general and special authorization to disclose was
            developed to comply with the provisions regarding disclosure of
            medical and other information under P.L. 104-191 ("HIPAA"); 45
            C.F.R. parts 160 and 164; 42 U.S.C. §290dd-2; 42 C.F.R. part 2, and
            State Law.
          </p>
          <h4>Authorization</h4>
          <h5>Records to be released</h5>
          <p>
            I voluntarily authorize and request disclosure (including paper,
            oral, and electronic interchange) of:{' '}
            <strong>All my medical records</strong>; including information
            related to my ability to perform tasks of daily living. This
            includes specific permission to release:
          </p>
          <ol>
            <li>
              All records and other information regarding my treatment,
              hospitalization, and outpatient care for my impairment(s)
              including, but not limited to:
              <ol type="a">
                <li>
                  Psychological, psychiatric, or other mental impairment(s)
                  excluding "psychotherapy notes" as defined in 45 C.F.R.
                  §164.501,
                </li>
                <li>Drug abuse, alcoholism, or other substance abuse,</li>
                <li>Sickle cell anemia,</li>
                <li>
                  Records which may indicate the presence of a communicable or
                  non-communicable disease; and tests for or records of
                  HIV/AIDS,
                </li>
                <li>
                  Gene-related impairments (including genetic test results)
                </li>
              </ol>
            </li>
            <li>
              Information about how my impairment(s) affects my ability to
              complete tasks and activities of daily living, and affects my
              ability to work.
            </li>
            <li>
              Information created within 12 months after the date I provide this
              authorization, as well as past information.
            </li>
          </ol>
          <p>
            I authorize the sources listed in{' '}
            <va-link
              href="#section-two"
              onClick={e => focusSection(e, '#section-two')}
              text="Section 2. Sources of records"
            />
            , to release any information that may have been obtained in
            connection with a physical, psychological or psychiatric examination
            or treatment, with the understanding that VA will use this
            information in determining my eligibility to Veterans benefits I
            have claimed.
          </p>
          <h4>Authorization and consent</h4>
          <p>
            <strong>Recipient</strong>: The Department of Veterans Affairs (VA)
          </p>
          <p>
            <strong>Purpose</strong>: Determining my eligibility for benefits,
            and whether you can manage such benefits
          </p>
          <p className="vads-u-margin-bottom--2">
            Although the information we obtain with this authorization is almost
            never used for any purpose other than those stated in this page, the
            information may be disclosed by VA without your consent if
            authorized by Federal laws such as the Privacy Act.
          </p>
          {privacyModalButton}
          <p>
            <strong>Expires</strong>: This authorization is good for 12 months
            from the date this form is submitted.
          </p>
          <p>By authorizing you acknowledge:</p>
          <ul>
            <li>
              I authorize the use of a copy (including electronic copy) of this
              authorization for the disclosure of information described in this
              page.
            </li>
            <li>
              I understand that there are some circumstances in which this
              information may be re-disclosed to other parties (review{' '}
              <va-link
                href="#acknowledgement"
                onClick={e => focusSection(e, '#acknowledgement')}
                text="Acknowledgment and HIPAA compliance"
              />
              ).
            </li>
            <li>
              I may write to VA and my source(s) to revoke this authorization at
              any time (review{' '}
              <va-link
                href="#section-one"
                onClick={e => focusSection(e, '#section-one')}
                text="Section 1. Expiration and
              how to cancel authorization"
              />
              ).
            </li>
            <li>
              VA will give me a copy of this authorization, if I ask. I may also
              ask the source(s) to allow me to inspect or get a copy of material
              to be disclosed.
            </li>
            <li>
              I have read this authorization and agree to the disclosures from
              the types of sources listed.
            </li>
          </ul>
          <p className="vads-u-margin-bottom--0">
            You’ll have the option on the next page to limit your authorization
            to types of sources and/or types of information.
          </p>
          <VaCheckbox
            className="vads-u-font-weight--bold vads-u-margin-top--3"
            id="privacy-agreement"
            name="privacy-agreement"
            label={AUTHORIZATION_LABEL}
            checked={data.privacyAgreementAccepted}
            onVaChange={handlers.onChange}
            required
            enable-analytics
          >
            {/* https://github.com/department-of-veterans-affairs/vets-design-system-documentation/issues/4219
            This empty slot is required for now due to a DST defect where a 
            "description" slot is required in order for the analytics to work */}
            <div slot="description" className="vads-u-display--none">
              <p />
            </div>
          </VaCheckbox>
        </div>
        <div className="vads-u-margin-top--5">
          {contentBeforeButtons}
          <FormNavButtons goBack={goBack} goForward={handlers.onGoForward} />
          {contentAfterButtons}
        </div>
      </form>
      <VaModal
        clickToClose
        modalTitle="Privacy Act Statement"
        onCloseEvent={toggle4142PrivacyModal}
        visible={modalVisible}
      >
        <PrivacyActStatementContent noRespondentBurden />
      </VaModal>
    </>
  );
};

Authorization.propTypes = customPageProps995;

export default Authorization;
