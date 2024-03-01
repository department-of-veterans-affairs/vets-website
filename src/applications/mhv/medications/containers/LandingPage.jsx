import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import FeedbackEmail from '../components/shared/FeedbackEmail';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import { medicationsUrls } from '../util/constants';
import { updatePageTitle } from '../../shared/util/helpers';
import { selectRefillContentFlag } from '../util/selectors';

const LandingPage = () => {
  const user = useSelector(selectUser);
  const location = useLocation();
  const fullState = useSelector(state => state);
  const { featureTogglesLoading, appEnabled } = useSelector(
    state => {
      return {
        featureTogglesLoading: state.featureToggles.loading,
        appEnabled:
          state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsToVaGovRelease],
      };
    },
    state => state.featureToggles,
  );
  const showRefillContent = useSelector(selectRefillContentFlag);

  const manageMedicationsHeader = useRef();
  const manageMedicationsAccordionSection = useRef();
  const [isRxRenewAccordionOpen, setIsRxRenewAccordionOpen] = useState(false);
  const medicationsUrl = fullState.user.login.currentlyLoggedIn
    ? medicationsUrls.MEDICATIONS_URL
    : medicationsUrls.MEDICATIONS_LOGIN;
  const refillUrl = fullState.user.login.currentlyLoggedIn
    ? medicationsUrls.MEDICATIONS_REFILL
    : medicationsUrls.MEDICATIONS_LOGIN;

  const focusAndOpenAccordionRxRenew = () => {
    setIsRxRenewAccordionOpen(true);
    focusElement(manageMedicationsHeader.current);
    if (!featureTogglesLoading && appEnabled) {
      manageMedicationsAccordionSection.current?.scrollIntoView();
    }
  };

  useEffect(
    () => {
      updatePageTitle('About medications | Veterans Affairs');
      if (location.pathname.includes('/accordion-renew-rx')) {
        focusAndOpenAccordionRxRenew();
      }
    },
    [location.pathname, featureTogglesLoading, appEnabled],
  );

  const content = () => {
    return (
      <div className="vads-l-col--12 medium-screen:vads-l-col--8">
        <div className="main-content">
          <section>
            <h1
              data-testid="landing-page-heading"
              className="vads-u-margin-top--4 vads-u-margin-bottom--0"
            >
              About medications
            </h1>
            <p className="vads-u-font-family--serif">
              Learn how to manage your VA prescriptions and review your
              medications list.
            </p>
          </section>
          <section>
            <div className="vads-u-background-color--gray-lightest vads-u-padding-y--2 vads-u-padding-x--3 vads-u-border-color">
              {showRefillContent ? (
                <>
                  <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--1.5 vads-u-font-size--h3">
                    Manage your medications
                  </h2>
                  <a
                    className="vads-u-display--block vads-c-action-link--blue vads-u-margin-bottom--1"
                    href={refillUrl}
                    data-testid="refill-nav-link"
                  >
                    Refill prescriptions
                  </a>
                  <a
                    className="vads-u-display--block vads-c-action-link--blue vads-u-margin--0"
                    href={medicationsUrl}
                    data-testid="prescriptions-nav-link"
                  >
                    Go to your medications list
                  </a>
                </>
              ) : (
                <>
                  <h2 className="vads-u-margin--0 vads-u-font-size--h3">
                    Go to your medications now
                  </h2>
                  <p className="vads-u-margin-y--3">
                    Refill and track your VA prescriptions. And review your
                    medications list.
                  </p>
                  <a
                    className="vads-c-action-link--green vads-u-margin--0"
                    href={medicationsUrl}
                    data-testid="prescriptions-nav-link"
                  >
                    Go to your medications
                  </a>
                </>
              )}
            </div>
          </section>
          <hr className="vads-u-margin-top--6" />
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
              <strong>Note:</strong> You still have access to the pharmacy tool
              on the My HealtheVet website. You can go back to that site at any
              time.{' '}
              <a
                href={mhvUrl(isAuthenticatedWithSSOe(fullState), 'pharmacy')}
                rel="noreferrer"
              >
                Go back to pharmacy on the My HealtheVet website
              </a>
            </p>
          </section>
          <section>
            <h2>Questions about this tool</h2>
            <section>
              <va-accordion bordered data-testid="accordion-dropdown" uswds>
                <va-accordion-item>
                  <h3 className="vads-u-font-size--h6" slot="headline">
                    Does this tool list all my medications and supplies?
                  </h3>
                  <p
                    data-testid="tool-information"
                    className="vads-u-margin-top--0"
                  >
                    This tool lists medications and supplies prescribed by your
                    VA providers. It also lists medications and supplies
                    prescribed by non-VA providers, if you filled them through a
                    VA pharmacy.
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
                      Other drugs you’re taking that you don’t have a
                      prescription for, including recreational drugs
                    </li>
                  </ul>
                  <p>
                    At this time, this tool doesn’t list these types of
                    medications and supplies:
                  </p>
                  <ul className="vads-u-margin-bottom--0">
                    <li>
                      <strong>Medications you entered yourself. </strong>
                      To find your self-entered medications, go back to the My
                      HealtheVet website.{' '}
                      <a
                        href={mhvUrl(
                          isAuthenticatedWithSSOe(fullState),
                          'self-entered-medications-supplements',
                        )}
                        rel="noreferrer"
                      >
                        Go to your self-entered medications on the My HealtheVet
                        website
                      </a>
                    </li>
                    <li>
                      <strong>
                        Certain supplies you order through our Denver Logistics
                        Center,
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
                  <p
                    data-testid="track-refill-prescription-info"
                    className="vads-u-margin-top--0"
                  >
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
                  <a href="/my-health/medications/about/accordion-renew-rx">
                    Learn how to renew prescriptions
                  </a>
                </va-accordion-item>
                <va-accordion-item>
                  <h3 className="vads-u-font-size--h6" slot="headline">
                    How long will it take to get my prescriptions?
                  </h3>
                  <p
                    data-testid="prescription-refill-info"
                    className="vads-u-margin-top--0"
                  >
                    Prescriptions usually arrive within 3 to 5 days after we
                    ship them. You can find tracking information in your
                    prescription details.
                  </p>
                  <p>
                    Request your next refill as soon as your prescription
                    arrives. Make sure to request refills{' '}
                    <strong>at least 15 days</strong> before you need more
                    medication.
                  </p>
                  <p className="vads-u-margin-bottom--0">
                    If your prescription is too old to refill or you have no
                    refills left, request a renewal{' '}
                    <strong>at least 15 days</strong> before you need more.
                  </p>
                </va-accordion-item>
                <va-accordion-item>
                  <h3 className="vads-u-font-size--h6" slot="headline">
                    Will VA protect my personal health information?
                  </h3>
                  <p
                    data-test-id="security-policy"
                    className="vads-u-margin-top--0"
                  >
                    Yes. This is a secure website. We follow strict security
                    policies and practices to protect your personal health
                    information.
                  </p>
                  <p>
                    If you print or download anything from the website (like
                    prescription details), you’ll need to take responsibility
                    for protecting that information.
                  </p>
                  <p className="vads-u-margin-bottom--0">
                    If you’re on a public or shared computer, remember that
                    downloading will save a copy of your records to that
                    computer. Make sure to delete any records you download to a
                    public computer.
                  </p>
                </va-accordion-item>
                <va-accordion-item>
                  <h3 className="vads-u-font-size--h6" slot="headline">
                    What if I have more questions?
                  </h3>
                  <p
                    data-testid="more-questions"
                    className="vads-u-margin-top--0"
                  >
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
                      rel="noreferrer"
                    >
                      Compose a message on the My HealtheVet website
                    </a>
                  </p>
                  <p className="vads-u-margin-bottom--0">
                    <strong>For questions about how to use this tool,</strong>{' '}
                    email us at <FeedbackEmail />.
                  </p>
                </va-accordion-item>
              </va-accordion>
            </section>
          </section>
          <section ref={manageMedicationsAccordionSection}>
            <h2 id="va-accordion" ref={manageMedicationsHeader}>
              More ways to manage your medications
            </h2>
            <p>
              {' '}
              Learn how to request a prescription renewal, update your mailing
              address, and review allergies and reactions in your VA medical
              records.
            </p>
            <section>
              <va-accordion uswds bordered data-testid="more-ways-to-manage">
                <va-accordion-item open={isRxRenewAccordionOpen}>
                  <h3 className="vads-u-font-size--h6" slot="headline">
                    How to renew prescriptions
                  </h3>
                  <p
                    data-testid="renew-information-button"
                    className="vads-u-margin--0"
                  >
                    If your prescription is too old to refill or has no refills
                    left, you’ll need to request a renewal. The fastest way to
                    renew is by calling the phone number on your prescription
                    label. You can also send a secure message to your care team.
                  </p>
                  <h4 className="vads-u-margin-top--2 vads-u-margin-bottom--1">
                    By phone
                  </h4>
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
                    system will direct your call to a pharmacy representative
                    for help.
                  </p>
                  <h4 className="vads-u-margin-top--2 vads-u-margin-bottom--1">
                    By secure messsage
                  </h4>
                  <p className="vads-u-margin-y--1">
                    Send a secure message to your VA care team.
                  </p>
                  <a
                    className="vads-u-margin-bottom--1 vads-u-display--block"
                    href={mhvUrl(
                      isAuthenticatedWithSSOe(fullState),
                      'secure-messaging',
                    )}
                    rel="noreferrer"
                  >
                    Compose a message on the My HealtheVet website
                  </a>
                  <section className="vads-u-margin-bottom--0">
                    <strong>
                      Include as much of this information as you can:
                    </strong>
                    <ul className="vads-u-margin-y--1">
                      <li>
                        Medication name, strength, and form (like LOSARTAN 50 MG
                        TAB)
                      </li>
                      <li>Prescription number</li>
                      <li>Provider who prescribed it</li>
                      <li>Number of refills left</li>
                      <li>Prescription expiration date</li>
                      <li>Reason for use</li>
                      <li>Quantity</li>
                    </ul>
                    You can find this information in your medication details in
                    this tool.
                  </section>
                  <p className="vads-u-margin-bottom--0">
                    <strong>Note:</strong> If you’re requesting renewals for
                    more than 1 prescription from the same care team, send 1
                    message with all of your requests.
                  </p>
                </va-accordion-item>
                <va-accordion-item>
                  <h3 className="vads-u-font-size--h6" slot="headline">
                    How to confirm or update your mailing address
                  </h3>
                  <p
                    data-testid="mailing-address-confirmation"
                    className="vads-u-margin-top--0"
                  >
                    We’ll send your prescriptions to the address we have on file
                    for you. We ship to all addresses in the U.S. and its
                    territories. We don’t ship prescriptions to foreign
                    countries.
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
                    How to manage notifications for prescription shipments
                  </h3>
                  <p
                    data-testid="notifications"
                    className="vads-u-margin-top--0"
                  >
                    You can sign up to get email notifications when we ship your
                    prescriptions. You can also opt out of notifications at any
                    time.
                  </p>
                  <p>
                    To review or update your notification settings, go to your
                    profile page on the My HealtheVet website.
                  </p>
                  <a
                    href={mhvUrl(
                      isAuthenticatedWithSSOe(fullState),
                      'profiles',
                    )}
                    rel="noreferrer"
                  >
                    Go to your profile on the My HealtheVet website
                  </a>
                </va-accordion-item>
                <va-accordion-item>
                  <h3 className="vads-u-font-size--h6" slot="headline">
                    How to review your allergies and reactions
                  </h3>
                  <p
                    data-testid="allergies-reactions-review"
                    className="vads-u-margin-top--0"
                  >
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
                    rel="noreferrer"
                  >
                    Go to your allergy and reaction records on the My HealtheVet
                    website
                  </a>
                </va-accordion-item>
              </va-accordion>
            </section>
          </section>
        </div>
        <va-back-to-top />
      </div>
    );
  };

  if (featureTogglesLoading) {
    return (
      <div className="vads-l-grid-container">
        <va-loading-indicator
          message="Loading..."
          setFocus
          data-testid="rx-feature-flag-loading-indicator"
        />
      </div>
    );
  }

  if (
    !appEnabled &&
    window.location.pathname !== medicationsUrls.MEDICATIONS_ABOUT
  ) {
    window.location.replace(medicationsUrls.MEDICATIONS_ABOUT);
    return <></>;
  }

  return (
    <RequiredLoginView
      user={user}
      serviceRequired={[backendServices.USER_PROFILE]}
    >
      <div className="landing-page vads-l-grid-container vads-u-margin-top--3 vads-u-margin-bottom--6">
        {content()}
      </div>
    </RequiredLoginView>
  );
};

export default LandingPage;
