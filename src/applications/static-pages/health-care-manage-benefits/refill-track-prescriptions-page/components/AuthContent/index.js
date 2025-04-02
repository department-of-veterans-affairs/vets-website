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
  cernerFacilitiesPropType,
  ehrDataByVhaIdPropType,
  otherFacilitiesPropType,
  useSingleLogoutPropType,
} from '../../../propTypes';

export const AuthContent = ({
  authenticatedWithSSOe,
  cernerFacilities,
  otherFacilities,
  ehrDataByVhaId,
  useSingleLogout,
  widgetType,
}) => (
  <>
    <CernerCallToAction
      cernerFacilities={cernerFacilities}
      otherFacilities={otherFacilities}
      ehrDataByVhaId={ehrDataByVhaId}
      linksHeaderText="Refill prescriptions from:"
      myHealtheVetLink={mhvUrl(
        authenticatedWithSSOe,
        'web/myhealthevet/refill-prescriptions',
      )}
      myVAHealthLink={getCernerURL(
        '/pages/medications/current',
        useSingleLogout,
      )}
      widgetType={widgetType}
    />
    <div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="how-can-the-va-prescription-re">
          How can VA’s prescription tools help me manage my health care?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                These web- and mobile-based services help you manage your VA
                prescriptions online.
              </p>
              <p>
                <strong>With these tools, you can:</strong>
              </p>
              <ul>
                <li>Refill your VA prescriptions online</li>
                <li>View your past and current VA prescriptions</li>
                <li>
                  Track the delivery of each prescription mailed within the past
                  30 days
                </li>
                <li>
                  Get email notifications to let you know when to expect your
                  prescriptions
                </li>
                <li>
                  Create lists to keep track of all your medicines (including
                  prescriptions, over-the-counter medicines, herbal remedies,
                  and supplements)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="am-i-eligible-to-use-this-tool">
          Am I eligible to use this tool?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                You can use these tools if you meet all of the requirements
                listed below.
              </p>
              <p>
                <strong>All of these must be true. You:</strong>
              </p>
              <ul>
                <li>
                  Are enrolled in VA health care, <strong>and</strong>
                </li>
                <li>
                  Are registered as a patient in a VA health facility,{' '}
                  <strong>and</strong>
                </li>
                <li>
                  Have a refillable prescription from a VA doctor that you’ve
                  filled at a VA pharmacy and that’s being handled by the VA
                  Mail Order Pharmacy
                </li>
              </ul>
              <p>
                <a href="/health-care/how-to-apply/">
                  Find out how to apply for VA health care
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="once-im-signed-in-how-do-i-get">
          Once I&apos;m signed in, how do I get started?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <h3>
                If you’re refilling and tracking prescriptions on My HealtheVet
              </h3>
              <p>
                On your Welcome page, you’ll find a module for{' '}
                <strong>Pharmacy</strong>. Within that module, you’ll find these
                3 options:
              </p>
              <ul>
                <li>
                  <strong>Refill VA Prescriptions</strong>
                </li>
                <li>
                  <strong>Track Delivery</strong>
                </li>
                <li>
                  <strong>Medications List</strong>
                </li>
              </ul>
              <p>
                Click on the link you want. You’ll get instructions on the next
                page to get started.
              </p>

              <h3>
                If you’re refilling and tracking prescriptions on My VA Health
              </h3>
              <p>
                In the navigation menu, you’ll find a section titled{' '}
                <strong>Pharmacy</strong>. Within that section, you’ll find
                these 2 options:
              </p>
              <ul>
                <li>
                  <strong>View current medications</strong>, and
                </li>
                <li>
                  <strong>View comprehensive medications</strong>
                </li>
              </ul>
              <p>
                Choose the medication list you want. For each medication, you’ll
                then find options to refill and renew.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="can-i-use-this-tool-to-refill-">
          Can I use these tools to refill and track all my VA prescriptions?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                <strong>
                  You can refill and track most of your VA prescriptions,
                  including:
                </strong>
              </p>
              <ul>
                <li>VA medicines that you’ve refilled or renewed</li>
                <li>Wound care supplies</li>
                <li>Diabetic supplies</li>
                <li>
                  Other products and supplies sent through the VA Mail Order
                  Pharmacy
                </li>
              </ul>
              <p>
                Your VA health care team may decide not to ship medicines that
                you don’t need right away, medicines that aren’t commonly
                prescribed, or those that require you to be closely monitored.
                In these cases, you’ll need to pick up your prescription from
                the VA health facility where you get care.
              </p>
              <p>
                You can’t refill some medicines, like certain pain medications
                and narcotics. You’ll need to get a new prescription from your
                VA provider each time you need more of these medicines.
              </p>
              <p>
                <strong>Note: </strong> If you receive care at both
                Mann-Grandstaff VA medical center and another VA facility, you
                may need to use both web portals to refill and track VA
                prescriptions.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="where-will-va-send-my-prescrip">
          Where will VA send my prescriptions?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                Our mail order pharmacy will send your prescriptions to the
                address we have on file for you. We ship to all addresses in the
                United States and its territories. We don’t ship prescriptions
                to foreign countries.
              </p>
              <p>
                <strong>Important note:</strong> Changing your address within My
                HealtheVet or My VA Health doesn’t change your address for
                prescription shipments.
              </p>
              <p>
                <strong>
                  To change your address on file with VA for prescription
                  shipments:
                </strong>
              </p>
              <ul>
                <li>
                  Go to your{' '}
                  <a href="/profile/contact-information">VA.gov profile</a>.
                  <br />
                  Click <strong>Edit</strong> next to each address you’d like to
                  change, including your mailing and home address. Or if you
                  haven’t yet added an address, click on the link to add your
                  address. Then fill out the form and click{' '}
                  <strong>Update</strong> to save your changes. You can also add
                  or edit other contact, personal, and military service
                  information.
                </li>

                <li>
                  Or contact the VA health facility where you get care to have
                  them update your address on file.
                  <br />
                  <a href="/find-locations/">Find your VA health facility</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="how-long-will-my-prescriptions">
          When will I get my prescriptions, and when should I reorder?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                Prescriptions usually arrive within 3 to 5 days. You can find
                specific information about your order on the website of the
                delivery service shown in My HealtheVet or My VA Health.
              </p>
              <p>
                To make sure you have your medicine in time, please request your
                refill at least 10 days before you need more medicine.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="will-my-personal-health-inform">
          Will my personal health information be protected?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <p>
                Yes. Our health management portals are secure websites. We
                follow strict security policies and practices to protect your
                personal health information.
              </p>
              <p>
                If you print or download anything from the website (like
                prescription details), you’ll need to take responsibility for
                protecting that information.
                <br />
                <a
                  href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/protecting-your-personal-health-information"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get tips for protecting your personal health information
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div itemScope itemType="http://schema.org/Question">
        <h2 itemProp="name" id="what-if-i-have-more-questions">
          What if I have more questions?
        </h2>
        <div
          itemProp="acceptedAnswer"
          itemScope
          itemType="http://schema.org/Answer"
        >
          <div itemProp="text">
            <div className="processed-content">
              <h3>For My HealtheVet questions</h3>
              <p>You can:</p>
              <ul>
                <li>
                  Read the{' '}
                  <a
                    rel="noreferrer noopener"
                    href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/faqs#PrescriptionRefill"
                  >
                    prescription refill FAQs
                  </a>{' '}
                  on the My HealtheVet web portal
                </li>
                <li>
                  Call the My HealtheVet help desk at{' '}
                  <va-telephone contact={CONTACTS.MY_HEALTHEVET} /> (
                  <va-telephone contact={CONTACTS.HELP_TTY} tty />
                  Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
                </li>
                <li>
                  Or{' '}
                  <a
                    rel="noreferrer noopener"
                    href="https://www.myhealth.va.gov/mhv-portal-web/web/myhealthevet/contact-mhv"
                  >
                    contact us online
                  </a>
                </li>
              </ul>
              <h3>For My VA Health questions</h3>
              <p>
                Call My VA Health support anytime at{' '}
                <va-telephone contact="8009621024" />.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

AuthContent.propTypes = {
  widgetType: PropTypes.string.isRequired,
  authenticatedWithSSOe: authenticatedWithSSOePropType,
  cernerFacilities: cernerFacilitiesPropType,
  ehrDataByVhaId: ehrDataByVhaIdPropType,
  otherFacilities: otherFacilitiesPropType,
  useSingleLogout: useSingleLogoutPropType,
};

export default AuthContent;
