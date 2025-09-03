import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const GetHelpPage = title => {
  useEffect(
    () => {
      focusElement('h1');
      document.title = title.title;
    },
    [title],
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

          <h2 id="overview">Overview of the portal</h2>

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
                with Login.gov or ID.me. By requiring sign-in with these
                methods, we ensure that all submitters have verified their
                identity with the federal government.
              </p>
            </va-accordion-item>
          </va-accordion>
          <h2 id="creating-your-account">Creating your account</h2>
          <p>
            Before using the Accredited Representative Portal (ARP) you will
            need to create a Login.gov account and associate it with your email
            on file with the VA’s Office of General Counsel (OGC).
          </p>
          <va-accordion>
            <va-accordion-item
              header="Steps for setting up your account"
              id="section-three"
              level="3"
            >
              <h4>Step 1: Identify the email you have on file with OGC.</h4>
              If you’re unsure which email you have on file with OGC, start by
              looking yourself up using the{' '}
              <Link
                className="content-link"
                to="https://www.va.gov/get-help-from-accredited-representative/find-rep/"
              >
                {' '}
                Find a Representative tool on VA.gov
              </Link>
              . If you don’t appear there, try using the{' '}
              <Link
                className="content-link"
                to="https://www.va.gov/ogc/apps/accreditation/index.asp"
              >
                {' '}
                OGC accreditation search tool
              </Link>
              . If your record appears in the OGC tool but not in the Find a
              Representative tool, it likely means VA doesn’t have a valid
              physical address on file for you.
              <h4>Step 2: Create a Login.gov account</h4>
              Login.gov is a secure way to sign in to many government websites
              with one account. Follow the instructions on Login.gov to create
              an account. Login.gov recommends that you use a personal email
              you’ll always have access to. You can use your work email instead
              if you prefer.
              <h4>
                Step 3: Associate your OGC email with your Login.gov account
              </h4>
              If you created your Login.gov account with your personal email,
              you’ll need to add the email address you have on file with OGC.
              While signed in to Login.gov, go to the “Your Account” menu and
              select “Add email address.” Enter your OGC email address and
              follow the prompts to confirm it.
              <h4>Step 4: Sign in to the portal</h4>
              Sign in to the portal at{' '}
              <Link
                className="content-link"
                to="https://www.va.gov/representative"
              >
                va.gov/representative
              </Link>
              . If you receive a message saying that we can’t verify you’re an
              accredited representative, refer to the commonly asked questions
              in this section for next steps.
            </va-accordion-item>
            <va-accordion-item
              header="What if I have issues creating my login.gov account?"
              id="section-four"
              level="3"
            >
              If you’re having trouble creating your Login.gov account, visit{' '}
              <Link className="content-link" to="https://login.gov/help/">
                Login.gov’s help resources
              </Link>{' '}
              for guidance.
            </va-accordion-item>
            <va-accordion-item
              header="What if I don’t have an email address on file with OGC, or I no longer use the email address that I have on file?"
              id="section-five"
              level="3"
            >
              <p>
                If you’re a Veteran Service Organization (VSO) representative,
                reach out to the certifying official at your Veteran Service
                Organization who handles the accreditation process. Ask them to
                request that OGC add an email to your file or update your
                existing email. If your contact information or physical address
                is outdated, request that OGC update it as well. We recommend
                against using a PO Box, since this will prevent your record from
                appearing in the Find a Representative tool.
              </p>
              <p>
                If you’re unsure who your certifying official is, contact your
                supervisor for guidance. Once the update is complete, add the
                new email address to your Login.gov account and try signing in
                to the portal.
              </p>
              <p>
                If you’re an accredited attorney or claims agent, follow the
                instructions on the PDF fact sheet, Process for Attorney and
                Claims Agent Contact Change Requests, provided by OGC. You can
                find this fact sheet on the{' '}
                <Link
                  className="content-link"
                  to="https://www.va.gov/ogc/accreditation.asp"
                >
                  OGC Accreditation webpage.
                </Link>
              </p>
            </va-accordion-item>
            <va-accordion-item
              header="What if I’ve associated my OGC email and still can’t sign in to the portal?"
              id="section-six"
              level="3"
            >
              Make sure the email address you have on file with OGC is unique to
              you. If you’re using a shared organization email that other
              representatives also use, the portal won’t grant you access. In
              that case, you’ll need to update your OGC email to one that only
              you use.
            </va-accordion-item>
            <va-accordion-item
              header="What if I’ve tried everything above and still can’t log in?"
              id="section-seven"
              level="3"
            >
              If you’re still unable to resolve the issue, email the portal team
              for help at {EmailHelpLink()}.
            </va-accordion-item>
            <va-accordion-item
              header="Can I use ID.me instead of login.gov?"
              id="section-eight"
              level="3"
            >
              The portal doesn’t currently support sign in using ID.me. If you
              have previously used ID.me to sign in to Stakeholder Enterprise
              Portal (SEP), you will be able to use the same ID.me account for
              the portal once we have added the ID.me sign-in option.
            </va-accordion-item>
            <va-accordion-item
              header="Can I sign in with my PIV?"
              id="section-ten"
              level="3"
            >
              <p>
                You can set up your Login.gov account to enable authentication
                with your PIV card. After creating your Login.gov account and
                associating it with the email on file with OGC, add your PIV
                card as an authentication method under “Add your government
                employee ID.” Next time you sign in, select the “Sign in with
                your government ID” option on the sign-in screen.
              </p>
              <p>
                We are exploring direct sign-in with PIV as a future
                enhancement.
              </p>
            </va-accordion-item>
            <va-accordion-item
              header="I’m both a Veteran and an accredited representative. Is the portal separate from VA.gov and will my usage of the portal impact benefits I receive as a Veteran?"
              id="section-eleven"
              level="3"
            >
              The benefits you receive as a Veteran won’t be affected when you
              use this portal. VA.gov uses your Veteran profile, while the
              portal uses a separate representative profile. There is no co-
              mingling of information between the two systems. If you are signed
              in to VA.gov and then sign in to the Accredited Representative
              Portal, you will be logged out of your VA.gov Veteran account.
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
            If you or one of your organizations has representation with an
            individual, you can submit forms through the portal on their behalf.
          </p>
          <va-accordion>
            <va-accordion-item
              header="Uploading and submitting completed PDFs"
              id="section-seventeen"
              level="3"
            >
              To submit VA forms, you will need to upload a completed PDF of the
              form and any additional relevant evidence or documentation. Prior
              to submission, the system will verify that you or one of your VSOs
              has existing representation with the claimant. We’ll notify you of
              the status of receipt in VBMS and track submissions for 60 days.
            </va-accordion-item>
            <va-accordion-item
              header="Supported forms"
              id="section-eighteen"
              level="3"
            >
              Currently, you can submit these forms through the portal:
              <ul>
                <li>
                  Application Request to Add and/or Remove Dependents (VA Form
                  21-686c)
                </li>
                <li>
                  Application for Disability Compensation and Related
                  Compensation Benefits (VA Form 21-526EZ)
                </li>
              </ul>
            </va-accordion-item>
            <va-accordion-item
              header="In SEP, I was able to submit a 21-686c and establish dependents within 24 hours. Will I be able to do this in the portal?"
              id="section-nineteen"
              level="3"
            >
              <p>
                The capability to establish dependents within 24 hours won’t be
                available in the portal upon initial release.
              </p>
              <p>
                We are exploring ways to speed up this process as a future
                enhancement.
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
              <h3 className="no-spacing-top">VA benefits hotline</h3>
              <p>
                <va-telephone contact="8008271000" />
                <br />
                Hours: Monday through Friday, 8:00 a.m. to 9:00 p.m. ET
              </p>
              <p>
                Call the VA benefits hotline to get help with finding out the
                status of a claim or appeal for disability compensation,
                pension, or survivors benefits (including a PACT Act claim).
              </p>
              <h3>Portal team</h3>
              <p>
                Email the Accredited Representative Portal team if you are
                unable to resolve sign-in issues, or if you are a VSO manager or
                certifying official and would like access to the Representation
                Request feature for your organization: {EmailHelpLink()}
              </p>
            </va-accordion-item>
          </va-accordion>
        </div>
      </div>
    </article>
  );
  /* eslint-enable no-irregular-whitespace */
};

export default GetHelpPage;
