import React from 'react';
import { useSelector } from 'react-redux';
import FeedbackEmail from '../components/shared/FeedbackEmail';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import { medicationsUrls } from '../util/constants';

const LandingPage = () => {
  const fullState = useSelector(state => state);
  const medicationsUrl = !fullState.user.login.currentlyLoggedIn
    ? medicationsUrls.prescriptionsUrl
    : medicationsUrls.medicationsLogin;

  const content = () => {
    return (
      <div className="landing-page">
        <div className="main-content">
          <section>
            <h1>About Medications</h1>
            <p className="vads-u-font-size--h3">
              Learn how to manage your VA prescriptions and review all
              medications in your VA medical records.
            </p>
          </section>
          <section>
            <a
              className="vads-c-action-link--green"
              href={medicationsUrl}
              data-testid="prescriptions-nav-link"
            >
              Go to your medications
            </a>
          </section>
          <section>
            <h2>What to know as you try out this tool</h2>
            <p>
              We’re giving the trusted My HealtheVet pharmacy tool a new home
              here on VA.gov. And we need your feedback to help us keep making
              this tool better for you and all Veterans.
            </p>
            <p>
              Email your feedback and questions to us at <FeedbackEmail />.
            </p>
            <p>
              <strong>Note:</strong>
              You still have access to the pharmacy tool on the My HealtheVet
              website. You can go back to that site at any time.{' '}
              <a
                href={mhvUrl(isAuthenticatedWithSSOe(fullState), 'pharmacy')}
                target="_blank"
                rel="noreferrer"
              >
                Go back to pharmacy on the My HealtheVet website
              </a>
            </p>
          </section>
          <section>
            <h2>Questions about this tool</h2>
            <va-accordion bordered data-testid="accordion-dropdown">
              <va-accordion-item>
                <h3 className="vads-u-font-size--h6" slot="headline">
                  Does this tool list all my medications and supplies?
                </h3>
                <p data-testid="tool-information">
                  This tool lists medications and supplies prescribed by your VA
                  providers. It also lists medications and supplies prescribed
                  by non-VA providers, if you filled them through a VA pharmacy.
                </p>
                <p>
                  If a VA provider entered them in your records, it will also
                  list these types of medications and supplies:
                </p>
                <ul>
                  <li>Prescriptions you filled through a non-VA pharmacy</li>
                  <li>
                    Over-the-counter medications, supplements, and herbal
                    remedies
                  </li>
                  <li>Sample medications a provider gave you</li>
                  <li>
                    Other drugs you’re taking that you don’t have a prescription
                    for, including recreational drugs
                  </li>
                </ul>
                <p>
                  At this time, this tool doesn’t list these types of
                  medications and supplies:
                </p>
                <ul>
                  <li>
                    <strong>Medications you entered yourself. </strong>
                    To find your self-entered medications, go back to your
                    medications list on the My HealtheVet website.{' '}
                    <a
                      href={mhvUrl(
                        isAuthenticatedWithSSOe(fullState),
                        'my-complete-medications-list',
                      )}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Go to your medications list on the My HealtheVet website
                    </a>
                  </li>
                  <li>
                    <strong>
                      Certain supplies you order through our Denver Logistics
                      Center,{' '}
                    </strong>{' '}
                    instead of through a VA pharmacy. This includes prosthetic
                    socks and hearing aid batteries.
                  </li>
                </ul>
              </va-accordion-item>
              <va-accordion-item>
                <h3 className="vads-u-font-size--h6" slot="headline">
                  What types of prescriptions can I refill and track in this
                  tool?
                </h3>
                <p data-testid="track-refill-prescription-info">
                  You can refill and track your shipments of most VA
                  prescriptions. This includes prescription medications and
                  prescription supplies, like diabetic supplies.
                </p>
                <p>
                  You can’t refill some medications. For example, certain pain
                  medications don’t allow refills. You’ll need to ask your VA
                  provider to renew your prescription each time you need more.
                </p>
                <p>
                  And if you have prescriptions that are too old to refill or
                  have no refills left, you’ll need to renew them to get more.
                </p>
                <a href="/my-health/medications/">
                  Learn how to renew prescriptions
                </a>
              </va-accordion-item>
              <va-accordion-item>
                <h3 className="vads-u-font-size--h6" slot="headline">
                  How long will it take to get my prescriptions?
                </h3>
                <p data-testid="prescription-refill-info">
                  Prescriptions usually arrive within 3 to 5 days after we ship
                  them. You can find tracking information in your prescription
                  details.
                </p>
                <p>
                  Request your next refill as soon as your prescription arrives.
                  Make sure to request refills <strong>at least 15 days</strong>{' '}
                  before you need more medication.
                </p>
                <p>
                  If your prescription is too old to refill or you have no
                  refills left, ask your care team to renew your prescription{' '}
                  <strong>at least 15 days</strong> before you need more.
                </p>
              </va-accordion-item>
              <va-accordion-item>
                <h3 className="vads-u-font-size--h6" slot="headline">
                  Will VA protect my personal health information?
                </h3>
                <p data-test-id="security-policy">
                  Yes. This is a secure website. We follow strict security
                  policies and practices to protect your personal health
                  information.
                </p>
                <p>
                  If you print or download anything from the website (like
                  prescription details), you’ll need to take responsibility for
                  protecting that information.
                </p>
                <p>
                  If you’re on a public or shared computer, remember that
                  downloading will save a copy of your records to that computer.
                  Make sure to delete any records you download to a public
                  computer.
                </p>
              </va-accordion-item>
              <va-accordion-item>
                <h3 className="vads-u-font-size--h6" slot="headline">
                  What if I have more questions?
                </h3>
                <p data-testid="more-questions">
                  <strong>
                    For questions about your medications and supplies,
                  </strong>{' '}
                  send a secure message to your care team.
                </p>
                <p>
                  <a
                    href={mhvUrl(
                      isAuthenticatedWithSSOe(fullState),
                      'secure-messaging',
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Compose a message on My HealthVet
                  </a>
                </p>
                <p>
                  For questions about how to use this tool, call the My
                  HealtheVet help desk at <va-telephone contact="8773270022" />{' '}
                  (<va-telephone contact="8008778339" tty />
                  ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m.
                  ET.
                </p>
              </va-accordion-item>
            </va-accordion>
          </section>
          <section>
            <h2>More ways to manage your medications</h2>
            <p>
              {' '}
              Learn how to renew prescriptions, update your mailing address, and
              review allergies and reactions in your VA medical records.
            </p>
            <va-accordion bordered>
              <va-accordion-item>
                <h3 className="vads-u-font-size--h6" slot="headline">
                  How to renew prescriptions
                </h3>
                <p data-testId="renew-information-button">
                  If your prescription is too old to refill or has no refills
                  left, you’ll need to request a renewal. The fastest way to
                  renew is by calling the phone number on your prescription
                  label. You can also send a secure message to your care team.
                </p>
                <h3>By phone</h3>
                <p>
                  Call your VA pharmacy’s automated refill line. Find the
                  pharmacy phone number on your prescription label or in your
                  prescription details in this tool. Follow the prompts to
                  select the automated refill line.
                </p>
                <p>
                  You’ll need the prescription number and your Social Security
                  number.
                </p>
                <p>
                  If our automated system can’t renew your prescription, the
                  system will direct your call to a pharmacy representative for
                  help.
                </p>
                <h3>By secure messsage</h3>
                <p>
                  Send a secure message to your VA care team. Include the
                  medication name, provide who prescribed it, and number of
                  refills left in your message.
                </p>
                <a
                  href={mhvUrl(
                    isAuthenticatedWithSSOe(fullState),
                    'secure-messaging',
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  Compose a message on My HealthVet
                </a>
              </va-accordion-item>
              <va-accordion-item>
                <h3 className="vads-u-font-size--h6" slot="headline">
                  How to confirm or update your mailing address
                </h3>
                <p data-testId="mailing-address-confirmation">
                  We’ll send your prescriptions to the address we have on file
                  for you. We ship to all addresses in the U.S. and its
                  territories. We don’t ship prescriptions to foreign countries.
                </p>
                <p>
                  To confirm or update your mailing address for prescription
                  shipments, contact your VA health facility.
                </p>
                <a href="/find-locations/?page=1&facilityType=health">
                  Find your VA health facility
                </a>
              </va-accordion-item>
              <va-accordion-item>
                <h3 className="vads-u-font-size--h6" slot="headline">
                  How to review your allergies and reactions
                </h3>
                <p data-testId="allergies-reactions-review">
                  Make sure your providers know about all your allergies and
                  reactions to medications.
                </p>
                <p>
                  If allergies or reactions are missing from your list, tell
                  your care team right away.
                </p>
                <a
                  href={mhvUrl(
                    isAuthenticatedWithSSOe(fullState),
                    'health-history',
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  Go to your allergy and reaction records on the My HealtheVet
                  website
                </a>
              </va-accordion-item>
            </va-accordion>
          </section>
        </div>
      </div>
    );
  };

  return (
    <div className="vads-u-margin-top--3 vads-u-margin-bottom--6">
      {content()}
    </div>
  );
};

export default LandingPage;
