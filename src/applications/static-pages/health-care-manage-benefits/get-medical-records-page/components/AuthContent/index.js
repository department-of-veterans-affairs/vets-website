// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
// Relative imports.
import { getCernerURL } from 'platform/utilities/cerner';
import { mhvUrl } from 'platform/site-wide/mhv/utilities';
import CernerCallToAction from '../../../components/CernerCallToAction';
import {
  authenticatedWithSSOePropType,
  useSingleLogoutPropType,
  cernerFacilitiesPropType,
  ehrDataByVhaIdPropType,
  otherFacilitiesPropType,
} from '../../../propTypes';

const AuthContent = ({
  authenticatedWithSSOe,
  cernerFacilities,
  otherFacilities,
  ehrDataByVhaId,
  useSingleLogout,
  widgetType,
}) => {
  return (
    <>
      <h2 id="va-blue-button">
        Use My HealtheVet or My VA Health to manage your records online
      </h2>
      <CernerCallToAction
        cernerFacilities={cernerFacilities}
        otherFacilities={otherFacilities}
        ehrDataByVhaId={ehrDataByVhaId}
        linksHeaderText="Get your medical records from:"
        myHealtheVetLink={mhvUrl(authenticatedWithSSOe, 'download-my-data')}
        myVAHealthLink={getCernerURL(
          '/pages/health_record/clinical_documents/sharing',
          useSingleLogout,
        )}
        widgetType={widgetType}
      />
      <h3>What are My HealtheVet and My VA Health, and which will I use?</h3>
      <p>
        My HealtheVet and My VA Health are both VA health management portals
        designed to help you manage your care. My VA Health is our new portal
        that providers at select facilities have started to use.
      </p>
      <p>
        Each portal offers a tool to help you manage your medical records. The
        portal you’ll use will depend on where you receive care. If you receive
        care at more than one VA facility, you may need to use both portals.
      </p>
      <h3>What you can do in My HealtheVet’s VA Blue Button</h3>
      <ul>
        <li>
          Download a customized Blue Button report with information from your VA
          medical records, personal health record, and in some cases your
          military service record
        </li>
        <li>
          Download a Health Summary that includes specific information from your
          VA medical records (like your known allergies, medicines, and recent
          lab results)
        </li>
        <li>
          Build your own personal health record that includes information like
          your self-entered medical history, emergency contacts, and medicines
        </li>
        <li>
          Monitor your vital signs and track your diet and exercise with our
          online journals
        </li>
        <li>
          Share a digital copy of the personal health information you entered
          yourself with your VA health care team through secure messaging
        </li>
      </ul>
      <h3>What you can do in My VA Health’s Health Records</h3>
      <ul>
        <li>
          Review and print your VA medical records—including your health
          profile, lab and test results, health conditions, and procedures
        </li>
        <li>Review, download, and share clinical documents</li>
      </ul>
      <h3>Who can manage VA medical records online</h3>
      <p>
        You can use these tools to get your VA medical records if you meet all
        of these requirements.
      </p>
      <p>
        <strong>All of these must be true:</strong>
      </p>
      <ul>
        <li>
          You’re enrolled in VA health care, <strong>and</strong>
        </li>
        <li>
          You’re registered as a patient in a VA health facility,{' '}
          <strong>and</strong>
        </li>
        <li>
          You have a verified <strong>Login.gov</strong> or{' '}
          <strong>ID.me</strong> account or a Premium <strong>DS Logon</strong>
        </li>
      </ul>
      <a href="/health-care/how-to-apply">
        Find out how to apply for VA health care
      </a>
      <h3>Questions about managing your VA medical records</h3>
      <va-accordion>
        <va-accordion-item id="first">
          <h4 slot="headline">
            Once I’m signed in, how do I access my medical records?
          </h4>
          <h5>If you’re accessing your records on My HealtheVet</h5>
          <p>
            Go to your welcome page dashboard. Then select{' '}
            <strong>Health Records</strong>. You’ll go to a new page.
          </p>
          <p>From here, you can choose to access these items:</p>
          <ul>
            <li>Your VA Blue Button report</li>
            <li>Your VA health summary</li>
            <li>Your VA medical images and reports</li>
          </ul>
          <strong>
            How can I add information to my personal health record in My
            HealtheVet?
          </strong>
          <p>
            Go to the main navigation menu. Then select{' '}
            <strong>Track Health</strong>. You’ll go to a new page.
          </p>
          <p>
            From here, you can choose to record different types of information
            like these:
          </p>
          <ul>
            <li>Vital signs</li>
            <li>Health history</li>
            <li>Health goals</li>
            <li>Food and exercise efforts</li>
          </ul>
          <h5>If you’re accessing your records on My VA Health</h5>
          <p>
            Go to the main navigation menu. Then select{' '}
            <strong>Health Record</strong>. You’ll go to a new page.
          </p>
          <p>From here, you can choose to access these items:</p>
          <ul>
            <li>Your VA health profile</li>
            <li>Your VA lab and test results</li>
            <li>Your health conditions and procedures</li>
            <li>Your VA clinical documents</li>
          </ul>
        </va-accordion-item>
        <va-accordion-item
          header="What if I can’t access all of my medical records in My HealtheVet or My VA Health?"
          id="second"
        >
          <p>
            You can request a complete copy of your medical records from your VA
            health facility or the Department of Defense (DoD), depending on
            where you received care.
          </p>
          <a href="/resources/how-to-get-your-medical-records-from-your-va-health-facility">
            Learn how to get medical records from your VA health facility
          </a>
          <br />
          <br />
          <a href="https://tricare.mil/PatientResources/MedicalRecords">
            Learn how to get DoD Health Records on the TRICARE website
          </a>
        </va-accordion-item>
        <va-accordion-item
          header="Will VA protect my personal health information?"
          id="third"
        >
          <p>
            Yes. My HealtheVet and My VA Health are secure websites. We follow
            strict security policies and practices to protect your personal
            health information.
          </p>
          <p>
            If you print or download anything from either website, you’ll need
            to take responsibility for protecting that information.
          </p>
        </va-accordion-item>
        <va-accordion-item
          header="How does VA share my health information with providers outside VA?"
          id="fourth"
        >
          <p>
            The Veterans Health Information Exchange (VHIE) program lets us
            securely share your health information with participating community
            care providers in our network. VHIE also lets us share your
            information with the Department of Defense.
          </p>
          <p>
            VHIE gives your health care providers a more complete understanding
            of your health record. This more complete understanding can help
            your providers make more informed treatment decisions. We share your
            health information with participating community providers only when
            they’re treating you.
          </p>
          <p>
            If you don’t want us to share your information through VHIE, you can
            opt out at any time.
          </p>
          <a href="/resources/the-veterans-health-information-exchange-vhie">
            Learn more about VHIE
          </a>
        </va-accordion-item>
        <va-accordion-item header="What if I have more questions?" id="fifth">
          <h4>For My HealtheVet questions</h4>
          <p>You can get more information in any of these ways:</p>
          <ul>
            <li>
              Read the FAQs pages on the My HealtheVet web portal
              <br />
              <a href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/faqs-blue-button">
                VA Blue Button FAQs
              </a>
              <br />
              <a href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/faqs-health-summary">
                VA health summary FAQs
              </a>
              <br />
              <a href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/what-are-va-medical-images-and-reports-faqs">
                VA medical images and reports FAQs
              </a>
            </li>
            <li>
              Call the My HealtheVet help desk at{' '}
              <va-telephone contact="8773270022" /> (
              <va-telephone contact={CONTACTS.HELP_TTY} tty />) Monday through
              Friday, 8:00 a.m. to 8:00 p.m. ET.
            </li>
            <li>
              <a href="https://www.myhealth.va.gov/contact-us">
                Contact us online through My HealtheVet
              </a>
            </li>
          </ul>
          <h4>For My VA Health questions</h4>
          <p>
            Call My VA Health support anytime at{' '}
            <va-telephone contact="8773270022" />.
          </p>
        </va-accordion-item>
      </va-accordion>
    </>
  );
};

AuthContent.propTypes = {
  widgetType: PropTypes.string.isRequired,
  authenticatedWithSSOe: authenticatedWithSSOePropType,
  cernerFacilities: cernerFacilitiesPropType,
  ehrDataByVhaId: ehrDataByVhaIdPropType,
  otherFacilities: otherFacilitiesPropType,
  useSingleLogout: useSingleLogoutPropType,
};

export default AuthContent;
