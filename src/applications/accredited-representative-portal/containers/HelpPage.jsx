import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import { HELP_BC_LABEL, HelpBC } from '../utilities/poaRequests';

const VAGovLink = () => (
  <>
    &nbsp;
    <Link className="content-link" to="https://va.gov">
      VA.gov
    </Link>
  </>
);
const EmailHelpLink = () => (
  <Link to="mailto:RepresentativePortalHelp@va.gov" className="content-link">
    RepresentativePortalHelp@va.gov
  </Link>
);
const RepresentationLink = () => (
  <>
    <Link
      to="https://www.va.gov/get-help-from-accredited-representative/appoint-rep/introduction/"
      className="content-link"
    >
      VA Form 21-22
    </Link>
  </>
);

const HelpPage = title => {
  const { hash } = useLocation();

  useEffect(
    () => {
      document.title = title.title;
      if (hash) {
        const id = hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth' });
            focusElement(`#${id}`);
          }, 500);
        }
      } else {
        focusElement('h1');
      }
    },
    [title, hash],
  );

  /* eslint-disable no-irregular-whitespace */
  return (
    <article className="help">
      <VaBreadcrumbs
        breadcrumbList={HelpBC}
        label={HELP_BC_LABEL}
        homeVeteransAffairs={false}
      />
      <h1 id="get-help-page-heading" data-testid="get-help-page-heading">
        Get help with the Accredited Representative Portal
      </h1>

      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--8 left-section">
          <p className="subtext">
            Learn about current and future features of the portal and how to get
            started using the portal. Get help resolving common issues with sign
            in.
          </p>
          <va-on-this-page />

          <h2 id="overview-of-the-portal">Overview of the portal</h2>

          <p>
            The Accredited Representative Portal is a secure online tool for
            accredited representatives to efficiently establish representation
            and manage their work supporting Veterans and dependents through the
            benefits claims process.
          </p>

          <va-accordion>
            <va-accordion-item
              header="Current and upcoming features"
              id="section-one"
              level="3"
            >
              The portal opens to all accredited representatives in Fall 2025.
              At that time, representatives will be able to complete these
              tasks:
              <ul>
                <li>
                  Establish representation by accepting requests that were
                  submitted using online {RepresentationLink()} on VA.gov.
                  Access the VBMS eFolder within minutes of establishing
                  representation.
                </li>
                <li>
                  Search for claimants to verify whether you or your
                  organization represents them.
                </li>
                <li>
                  Upload and submit completed PDFs and evidence for VA Forms
                  21-686c and 21-526EZ.
                </li>
              </ul>
              We will expand the portal’s capabilities over time, starting with
              these tasks:
              <ul>
                <li>Access the portal with the ID.me sign-in method</li>
                <li>Submit additional types of VA forms</li>
                <li>View summary information about a claimant</li>
                <li>
                  Complete and submit the Application for Accreditation as a
                  Claims Agent or Attorney (VA Form 21a)
                </li>
              </ul>
            </va-accordion-item>
            <va-accordion-item
              header="How does the portal prevent fraud and ensure security?"
              id="section-two"
              level="3"
            >
              <p>
                Accredited representatives must sign in to the portal with a
                VA-approved sign-in account. During sign-in, the system checks
                with the VA’s Office of General Counsel (OGC) to confirm current
                accreditation. If the system can’t verify current accreditation,
                we restrict access to portal features. These identity checks
                make fraud very difficult.
              </p>
              <p>
                To submit {RepresentationLink()} on VA.gov, Veterans must sign
                in to their {VAGovLink()} account, which requires authentication
                with ID.me or Login.gov. By requiring sign-in with these
                methods, we ensure that all submitters have verified their
                identity with the federal government.
              </p>
            </va-accordion-item>
          </va-accordion>
          <h2 id="creating-your-account">Creating your account</h2>
          <p>
            To use the Accredited Representative Portal, you need to create an
            ID.me or a Login.gov account and associate it with your email on
            file with the VA’s Office of General Counsel (OGC).
          </p>
          <va-accordion>
            <va-accordion-item
              header="Setting up your account"
              id="section-three"
              level="3"
            >
              <h3 className="vads-u-font-size--h4">
                Step 1: Identify the email you have on file with OGC
              </h3>
              <p>
                If you’re unsure which email you have on file with OGC, look
                yourself up using the{' '}
                <Link
                  className="content-link"
                  to="https://www.va.gov/get-help-from-accredited-representative/find-rep/"
                >
                  Find a Representative tool (VA.gov)
                </Link>
                . If you have an email on file with OGC, it will be displayed
                there.
                <br />
                <br />
                If you aren’t able to find yourself using the Find a
                Representative tool, try using the{' '}
                <Link
                  className="content-link"
                  to="https://www.va.gov/get-help-from-accredited-representative/find-rep/"
                >
                  OGC accreditation search tool
                </Link>
                . If you are found in the OGC tool but not the Find a
                Representative tool, it likely means VA doesn’t have a valid
                physical address on file for you.
              </p>
              <h3 className="vads-u-font-size--h4">
                Step 2: Create an ID.me or Login.gov account
              </h3>
              <p>
                ID.me and Login.gov are services that provide secure ways to
                sign in to many government websites using just one account. When
                creating your account, it’s recommended to use a personal email
                you’ll always have access to. Follow the service provider’s
                instructions to create your account.
              </p>
              <Link
                className="content-link"
                to="https://login.gov/help/create-account/how-do-i-create-an-account/"
              >
                Learn how to create your Login.gov account
              </Link>
              <br />
              <Link
                className="content-link"
                to="https://help.id.me/hc/en-us/articles/202673924-Create-your-ID-me-account"
              >
                Learn how to create your ID.me account
              </Link>
              <h3 className="vads-u-font-size--h4">
                Step 3: Associate your OGC email with your account
              </h3>
              <p>
                If you created your ID.me or Login.gov account using your
                personal email, you’ll need to add the email address you have on
                file with OGC. Follow the service provider’s instructions to add
                an email to your account.
              </p>
              <Link
                className="content-link"
                to="https://www.login.gov/help/manage-your-account/change-your-email-address/"
              >
                Learn how to add an email to your Login.gov account
              </Link>
              <br />
              <Link
                className="content-link"
                to="https://help.id.me/hc/en-us/articles/19679310213271-Add-a-work-or-business-email-to-your-ID-me-account"
              >
                Learn how to add an email to your ID.me account
              </Link>
              <h3 className="vads-u-font-size--h4">
                Step 4: Sign in to the portal
              </h3>
              <p>
                Sign in to the portal at va.gov/representative . If you receive
                a message saying that we can’t verify you’re an accredited
                representative, refer to the commonly asked questions in this
                section for next steps.
              </p>
            </va-accordion-item>
            <va-accordion-item
              header="What if I’m having trouble creating my account?"
              id="section-four"
              level="3"
            >
              <p>
                We can help guide you to fix some common issues as you create
                your account and verify your identity.
              </p>
              <Link
                className="content-link"
                to="https://www.va.gov/resources/support-for-common-logingov-and-idme-issues/"
              >
                Get support for common ID.me and Login.gov issues
              </Link>
              <br />
              <br />
              <p>
                Or you can get more help on each account provider’s website.
              </p>
              <p>
                <Link className="content-link" to="https://help.id.me/hc/en-us">
                  Go to the ID.me support section
                </Link>
                <br />
                <Link className="content-link" to="https://login.gov/help/">
                  Go to the Login.gov help center
                </Link>
              </p>
            </va-accordion-item>
            <va-accordion-item
              header="What if I don’t have an email on file with OGC, or the email is incorrect?"
              id="section-six"
              level="3"
            >
              <p>
                <strong>
                  If you’re a Veteran Service Organization (VSO) representative
                </strong>
                , reach out to the certifying official at your VSO who handles
                the accreditation process. Ask them to request that OGC add an
                email to your file or update your existing email. If your
                contact information or physical address is outdated, request
                that OGC update it as well. We recommend against using a PO Box,
                since this will prevent your record from appearing in the Find a
                Representative tool.
              </p>
              <p>
                If you’re unsure who your certifying official is, contact your
                supervisor for guidance. Once the OGC update is complete, add
                the updated email address to your Login.gov account and try
                signing in to the portal.
              </p>
              <p>
                <strong>
                  If you’re an accredited attorney or claims agent
                </strong>
                , follow the instructions on the PDF fact sheet,{' '}
                <Link
                  className="content-link"
                  to="https://www.va.gov/OGC/docs/Accred/FactSheet_OBI-21-03.pdf"
                >
                  Process for Attorney and Claims Agent Contact Change Requests
                </Link>
                , found on the{' '}
                <Link
                  className="content-link"
                  to="https://www.va.gov/ogc/accreditation.asp"
                >
                  OGC Accreditation webpage
                </Link>
                .
              </p>
            </va-accordion-item>
            <va-accordion-item
              header="What if I’ve associated my OGC email and still can’t sign in to the portal?"
              id="section-eight"
              level="3"
            >
              <p>
                Make sure the email address you have on file with OGC is unique
                to you. If you’re using a shared organization email that other
                representatives also use, the portal won’t grant you access. In
                that case, you’ll need to update your OGC email to one that only
                you use.
              </p>
            </va-accordion-item>
            <va-accordion-item
              header="What if I've tried everything and still can’t sign in?"
              id="section-seven"
              level="3"
            >
              <p>
                If you’re still unable to resolve the issue, call the VA
                accredited representative support line at{' '}
                <va-telephone contact="8552250709" />.
              </p>
            </va-accordion-item>
            <va-accordion-item
              header="Can I sign in with my PIV?"
              id="section-ten"
              level="3"
            >
              <p>Yes, but only if you’re using Login.gov.</p>
              <p>
                After creating your Login.gov account and associating it with
                your email on file with OGC, you can add your PIV card as an
                authentication method. After you add your PIV card to your
                account, select the “Sign in with your government ID” option the
                next time you sign in.
              </p>
              <p>
                <Link
                  className="content-link"
                  to="https://www.login.gov/help/create-account/authentication-methods/piv-cac/"
                >
                  Learn how to set up your PIV card on an existing Login.gov
                  account
                </Link>
              </p>
              <p>
                <strong>Note:</strong> We are exploring direct sign-in with PIV
                as a future enhancement.
              </p>
            </va-accordion-item>
            <va-accordion-item
              header="I’m also a Veteran. Will my Veteran benefits be impacted by my usage of the portal?"
              id="section-eleven"
              level="3"
            >
              <p>
                No, the benefits you receive as a Veteran won’t be affected by
                using the portal.
              </p>

              <p>
                VA.gov uses your Veteran profile, while the portal uses a
                separate representative profile. There is no co-mingling of
                information between the two systems.
              </p>
            </va-accordion-item>
          </va-accordion>
          <h2 id="establishing-representation">Establishing representation</h2>
          <p>
            You can quickly establish representation with a Veteran by using the
            portal Representation Requests feature. The portal currently manages
            requests from Veterans to appoint a Veteran Service Organization
            (VSO) to represent them.
          </p>
          <va-accordion>
            <va-accordion-item
              header="Receiving representation requests in the portal"
              id="section-twelve"
              level="3"
            >
              <p>
                For you to receive a request in the portal, the Veteran needs to
                submit the online {RepresentationLink()} on VA.gov. They will
                need to sign in to VA.gov to submit the form. Instruct the
                Veteran to select you as the accredited representative, and to
                appoint one of your organizations that accepts online
                submissions when filling out the online form. Once the Veteran
                submits the online form, a representation request will populate
                in the portal and can be reviewed by any representative who is
                accredited with the appointed VSO.
              </p>
              <p>
                <strong>Note:</strong> We encourage you to test completing the
                online {RepresentationLink()} to understand the Veteran
                experience.
              </p>
            </va-accordion-item>
            <va-accordion-item
              header="Accepting and declining requests"
              id="section-thirteen"
              level="3"
            >
              <p>
                After signing in to the portal, you can review a list of
                representation requests that appoint one of your VSOs. If the
                Veteran specified an individual representative they would like
                to work with, the request would include the name of this
                individual in the preferred representative field.
              </p>
              <p>
                The request details show whether the Veteran authorized access
                to protected medical records and address changes. After
                reviewing this information, you (or any other representative
                accredited with the appointed VSO) can accept or decline the
                request. The portal will then send a notification of the
                decision to the Veteran. Once you accept representation, you can
                view the Veteran’s eFolder in VBMS within minutes.
              </p>
              <p>
                To meet additional security standards, representation requests
                expire after 60 days. Expired requests are removed from the
                portal for data security purposes.
              </p>
              <p>
                <strong>Note:</strong> The portal only shows requests that were
                submitted using online {RepresentationLink()}. It will not show
                requests made through mail, fax, QuickSubmit, or other tools.
                Also, the portal is the only tool where you can view these
                online requests.
              </p>
            </va-accordion-item>
            <va-accordion-item
              header="Gaining access to the Representation Request feature"
              id="section-fourteen"
              level="3"
            >
              If you’d like access to this feature, ask the VSO manager or
              certifying official at one or more of your organizations to email
              us at {EmailHelpLink()}. Organizations must opt in to using this
              feature for it to be available in the portal for their
              representatives.
            </va-accordion-item>
          </va-accordion>
          <h2 id="searching-for-claimants-you-represent">
            Searching for claimants you represent
          </h2>
          <p>
            You can find claimants who have recently requested representation or
            who have existing representation with you or one of your VSOs.
          </p>
          <va-accordion>
            <va-accordion-item
              header="How to search using the tool"
              id="section-fifteen"
              level="3"
            >
              To search for a claimant, you’ll need to enter their first name,
              last name, date of birth, and Social Security number. Even if you
              enter the information correctly, you’ll receive a “No result
              found” message if the individual doesn’t have a recent
              representation request or existing representation with you or one
              of your VSOs.
            </va-accordion-item>
            <va-accordion-item
              header="Does the search function check for limited representation?"
              id="section-sixteen"
              level="3"
            >
              <p>
                The portal doesn’t currently check for limited representation.
                By limited representation, we mean that the representation is
                for a specific claim or claims. Check with the claimant or in
                VBMS for any existing limited representation.
              </p>
              <p>
                We are exploring search for limited representation as a future
                enhancement.
              </p>
            </va-accordion-item>
          </va-accordion>
          <h2 id="submitting-va-forms">Submitting VA forms</h2>
          <p>
            There are two methods the portal uses for submissions. Some forms
            require you to upload a completed PDF to submit. Other forms can be
            submitted by filling out the required steps in the portal.
          </p>
          <p>
            Prior to submission, the system will verify that you or your
            Veterans Service Organization (VSO) currently represent the
            claimant.
          </p>
          <va-accordion>
            <va-accordion-item
              header="VA Form 21-0966 (Intent to File a Claim for Compensation and/or Pension, or Survivors Pension and/or DIC)"
              id="section-seventeen"
              level="3"
            >
              <p>
                Fill out the required steps in the portal for VA Form 21-0966,
                and then submit.
              </p>
              <p>
                The intent to file will be recorded immediately after
                submission.
              </p>
            </va-accordion-item>
            <va-accordion-item
              header="VA Form 21-526EZ (Application for Disability Compensation and Related Compensation Benefits)"
              id="section-eighteen"
              level="3"
            >
              <p>Upload the completed VA Form 21-526EZ PDF, and then submit.</p>
              <p>
                The form will be processed by VA Centralized Mail after
                submission. We’ll notify you of the status of receipt in VBMS.
                The portal will track the submission for 60 days.
              </p>
            </va-accordion-item>
            <va-accordion-item
              header="VA Form 21-686c (Application Request to Add and/or Remove Dependents)"
              id="section-nineteen"
              level="3"
            >
              <p>
                Upload the completed VA Form 21-686c PDF and any supporting
                evidence, and then submit.
              </p>
              <p>
                The form will be processed by VA Centralized Mail after
                submission. We’ll notify you of the status of receipt in VBMS.
                The portal will track the submission for 60 days.
              </p>
              <p>
                <strong>Note:</strong> The portal isn’t able to establish
                dependents within 24 hours at this time. We’re exploring ways to
                speed up this process as a future enhancement.
              </p>
            </va-accordion-item>
          </va-accordion>
          <div className="va-h-ruled--stars mobile-view-divider" />
        </div>
        <div className="vads-l-col--12 medium-screen:vads-l-col--4 contact-us">
          <va-accordion open-single>
            <va-accordion-item
              header="Contact Us"
              id="section-twenty"
              level="2"
              open="open"
            >
              <h3 className="no-spacing-top vads-u-font-size--h4">
                VA accredited representative support line
              </h3>
              <p>
                <va-telephone contact="8552250709" />
                <br />
                Hours: Monday through Friday, 8:00 a.m. to 9:00 p.m. ET
              </p>
              <p>
                Call the VA accredited representative support line to get help
                with these needs:
                <ul>
                  <li>
                    Find out the status of a claim or appeal for disability
                    compensation, pension, or survivors benefits (including a
                    PACT Act claim)
                  </li>
                  <li>Resolve issues with sign-in to the portal</li>
                  <li>
                    Get answers to your other questions about the Accredited
                    Representative Portal
                  </li>
                </ul>
              </p>
              <h3 className="vads-u-font-size--h4">Portal team</h3>
              <p>
                Email the Accredited Representative Portal team at{' '}
                {EmailHelpLink()}
                if you’re a VSO manager or certifying official and you’d like
                access to the Representation Request feature for your
                organization.
              </p>
            </va-accordion-item>
          </va-accordion>
        </div>
      </div>
    </article>
  );
  /* eslint-enable no-irregular-whitespace */
};

export default HelpPage;
