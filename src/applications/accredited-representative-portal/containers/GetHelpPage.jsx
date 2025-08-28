import React, { useEffect } from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import { HELP_BC_LABEL, HelpBC } from '../utilities/poaRequests';

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
            The Accredited Representative Portal (ARP) is a secure digital
            platform for accredited representatives to efficiently manage their
            work supporting Veterans through the benefits claims process.
            Accredited representatives can also manage and maintain their
            relationship with the VA within the same portal.
          </p>

          <va-accordion>
            <va-accordion-item
              header="Current and upcoming features"
              id="section-one"
              level="3"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              augue erat, finibus a egestas ac, sodales sit amet diam. Aliquam
              efficitur est sit amet blandit malesuada. Maecenas sit amet ex non
              nulla fringilla maximus id quis justo. Vivamus interdum ante
              tellus, eu convallis urna placerat ut. Ut scelerisque maximus
              neque, ac elementum leo ultricies nec. Duis sagittis consequat
              orci eu lacinia. Donec sodales nulla ac tellus venenatis, sit amet
              pulvinar nisl pulvinar. Duis enim mauris, egestas sit amet
              pulvinar non, pulvinar ac nulla. Vivamus consequat ante ac magna
              dapibus sagittis. Nulla molestie urna aliquet, viverra odio eget,
              fermentum nisl. Praesent sed orci leo. Cras scelerisque tristique
              turpis, mattis aliquet nisi fringilla vitae.
            </va-accordion-item>
            <va-accordion-item
              header="How does the portal prevent fraud and ensure security?"
              id="section-two"
              level="3"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              augue erat, finibus a egestas ac, sodales sit amet diam. Aliquam
              efficitur est sit amet blandit malesuada. Maecenas sit amet ex non
              nulla fringilla maximus id quis justo. Vivamus interdum ante
              tellus, eu convallis urna placerat ut. Ut scelerisque maximus
              neque, ac elementum leo ultricies nec. Duis sagittis consequat
              orci eu lacinia. Donec sodales nulla ac tellus venenatis, sit amet
              pulvinar nisl pulvinar. Duis enim mauris, egestas sit amet
              pulvinar non, pulvinar ac nulla. Vivamus consequat ante ac magna
              dapibus sagittis. Nulla molestie urna aliquet, viverra odio eget,
              fermentum nisl. Praesent sed orci leo. Cras scelerisque tristique
              turpis, mattis aliquet nisi fringilla vitae.
            </va-accordion-item>
          </va-accordion>
          <h2 id="creating-your-account">Creating your account</h2>
          <p>
            Before using the Accredited Representative Portal (ARP) you will
            need to set up a Login.gov account and associate it with your email
            on file with the VA’s Office of General Counsel (OGC).
          </p>
          <va-accordion>
            <va-accordion-item
              header="Steps for setting up your account"
              id="section-three"
              level="3"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              augue erat, finibus a egestas ac, sodales sit amet diam. Aliquam
              efficitur est sit amet blandit malesuada. Maecenas sit amet ex non
              nulla fringilla maximus id quis justo. Vivamus interdum ante
              tellus, eu convallis urna placerat ut. Ut scelerisque maximus
              neque, ac elementum leo ultricies nec. Duis sagittis consequat
              orci eu lacinia. Donec sodales nulla ac tellus venenatis, sit amet
              pulvinar nisl pulvinar. Duis enim mauris, egestas sit amet
              pulvinar non, pulvinar ac nulla. Vivamus consequat ante ac magna
              dapibus sagittis. Nulla molestie urna aliquet, viverra odio eget,
              fermentum nisl. Praesent sed orci leo. Cras scelerisque tristique
              turpis, mattis aliquet nisi fringilla vitae.
            </va-accordion-item>
            <va-accordion-item
              header="What if I have issues creating my login.gov account?"
              id="section-four"
              level="3"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              augue erat, finibus a egestas ac, sodales sit amet diam. Aliquam
              efficitur est sit amet blandit malesuada. Maecenas sit amet ex non
              nulla fringilla maximus id quis justo. Vivamus interdum ante
              tellus, eu convallis urna placerat ut. Ut scelerisque maximus
              neque, ac elementum leo ultricies nec. Duis sagittis consequat
              orci eu lacinia. Donec sodales nulla ac tellus venenatis, sit amet
              pulvinar nisl pulvinar. Duis enim mauris, egestas sit amet
              pulvinar non, pulvinar ac nulla. Vivamus consequat ante ac magna
              dapibus sagittis. Nulla molestie urna aliquet, viverra odio eget,
              fermentum nisl. Praesent sed orci leo. Cras scelerisque tristique
              turpis, mattis aliquet nisi fringilla vitae.
            </va-accordion-item>
            <va-accordion-item
              header="What if I don’t have an email address on file with OGC, or I no longer use the email address that I have on file?"
              id="section-five"
              level="3"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              augue erat, finibus a egestas ac, sodales sit amet diam. Aliquam
              efficitur est sit amet blandit malesuada. Maecenas sit amet ex non
              nulla fringilla maximus id quis justo. Vivamus interdum ante
              tellus, eu convallis urna placerat ut. Ut scelerisque maximus
              neque, ac elementum leo ultricies nec. Duis sagittis consequat
              orci eu lacinia. Donec sodales nulla ac tellus venenatis, sit amet
              pulvinar nisl pulvinar. Duis enim mauris, egestas sit amet
              pulvinar non, pulvinar ac nulla. Vivamus consequat ante ac magna
              dapibus sagittis. Nulla molestie urna aliquet, viverra odio eget,
              fermentum nisl. Praesent sed orci leo. Cras scelerisque tristique
              turpis, mattis aliquet nisi fringilla vitae.
            </va-accordion-item>
            <va-accordion-item
              header="What if I’ve associated my OGC email and still can’t log into ARP?"
              id="section-six"
              level="3"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              augue erat, finibus a egestas ac, sodales sit amet diam. Aliquam
              efficitur est sit amet blandit malesuada. Maecenas sit amet ex non
              nulla fringilla maximus id quis justo. Vivamus interdum ante
              tellus, eu convallis urna placerat ut. Ut scelerisque maximus
              neque, ac elementum leo ultricies nec. Duis sagittis consequat
              orci eu lacinia. Donec sodales nulla ac tellus venenatis, sit amet
              pulvinar nisl pulvinar. Duis enim mauris, egestas sit amet
              pulvinar non, pulvinar ac nulla. Vivamus consequat ante ac magna
              dapibus sagittis. Nulla molestie urna aliquet, viverra odio eget,
              fermentum nisl. Praesent sed orci leo. Cras scelerisque tristique
              turpis, mattis aliquet nisi fringilla vitae.
            </va-accordion-item>
            <va-accordion-item
              header="If I’ve tried everything above and still can’t log in?"
              id="section-seven"
              level="3"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              augue erat, finibus a egestas ac, sodales sit amet diam. Aliquam
              efficitur est sit amet blandit malesuada. Maecenas sit amet ex non
              nulla fringilla maximus id quis justo. Vivamus interdum ante
              tellus, eu convallis urna placerat ut. Ut scelerisque maximus
              neque, ac elementum leo ultricies nec. Duis sagittis consequat
              orci eu lacinia. Donec sodales nulla ac tellus venenatis, sit amet
              pulvinar nisl pulvinar. Duis enim mauris, egestas sit amet
              pulvinar non, pulvinar ac nulla. Vivamus consequat ante ac magna
              dapibus sagittis. Nulla molestie urna aliquet, viverra odio eget,
              fermentum nisl. Praesent sed orci leo. Cras scelerisque tristique
              turpis, mattis aliquet nisi fringilla vitae.
            </va-accordion-item>
            <va-accordion-item
              header="Can I use ID.me instead of login.gov?"
              id="section-eight"
              level="3"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              augue erat, finibus a egestas ac, sodales sit amet diam. Aliquam
              efficitur est sit amet blandit malesuada. Maecenas sit amet ex non
              nulla fringilla maximus id quis justo. Vivamus interdum ante
              tellus, eu convallis urna placerat ut. Ut scelerisque maximus
              neque, ac elementum leo ultricies nec. Duis sagittis consequat
              orci eu lacinia. Donec sodales nulla ac tellus venenatis, sit amet
              pulvinar nisl pulvinar. Duis enim mauris, egestas sit amet
              pulvinar non, pulvinar ac nulla. Vivamus consequat ante ac magna
              dapibus sagittis. Nulla molestie urna aliquet, viverra odio eget,
              fermentum nisl. Praesent sed orci leo. Cras scelerisque tristique
              turpis, mattis aliquet nisi fringilla vitae.
            </va-accordion-item>
            <va-accordion-item
              header="In the past, I used ID.me to log into SEP (Stakeholder Enterprise Portal). Will the same sign in method work for ARP?"
              id="section-nine"
              level="3"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              augue erat, finibus a egestas ac, sodales sit amet diam. Aliquam
              efficitur est sit amet blandit malesuada. Maecenas sit amet ex non
              nulla fringilla maximus id quis justo. Vivamus interdum ante
              tellus, eu convallis urna placerat ut. Ut scelerisque maximus
              neque, ac elementum leo ultricies nec. Duis sagittis consequat
              orci eu lacinia. Donec sodales nulla ac tellus venenatis, sit amet
              pulvinar nisl pulvinar. Duis enim mauris, egestas sit amet
              pulvinar non, pulvinar ac nulla. Vivamus consequat ante ac magna
              dapibus sagittis. Nulla molestie urna aliquet, viverra odio eget,
              fermentum nisl. Praesent sed orci leo. Cras scelerisque tristique
              turpis, mattis aliquet nisi fringilla vitae.
            </va-accordion-item>
            <va-accordion-item
              header="Can I use my PIV card to log into the portal?"
              id="section-ten"
              level="3"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              augue erat, finibus a egestas ac, sodales sit amet diam. Aliquam
              efficitur est sit amet blandit malesuada. Maecenas sit amet ex non
              nulla fringilla maximus id quis justo. Vivamus interdum ante
              tellus, eu convallis urna placerat ut. Ut scelerisque maximus
              neque, ac elementum leo ultricies nec. Duis sagittis consequat
              orci eu lacinia. Donec sodales nulla ac tellus venenatis, sit amet
              pulvinar nisl pulvinar. Duis enim mauris, egestas sit amet
              pulvinar non, pulvinar ac nulla. Vivamus consequat ante ac magna
              dapibus sagittis. Nulla molestie urna aliquet, viverra odio eget,
              fermentum nisl. Praesent sed orci leo. Cras scelerisque tristique
              turpis, mattis aliquet nisi fringilla vitae.
            </va-accordion-item>
            <va-accordion-item
              header="I’m both a Veteran and an accredited representative. Will using the portal impact the benefits I receive as a Veteran?"
              id="section-eleven"
              level="3"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              augue erat, finibus a egestas ac, sodales sit amet diam. Aliquam
              efficitur est sit amet blandit malesuada. Maecenas sit amet ex non
              nulla fringilla maximus id quis justo. Vivamus interdum ante
              tellus, eu convallis urna placerat ut. Ut scelerisque maximus
              neque, ac elementum leo ultricies nec. Duis sagittis consequat
              orci eu lacinia. Donec sodales nulla ac tellus venenatis, sit amet
              pulvinar nisl pulvinar. Duis enim mauris, egestas sit amet
              pulvinar non, pulvinar ac nulla. Vivamus consequat ante ac magna
              dapibus sagittis. Nulla molestie urna aliquet, viverra odio eget,
              fermentum nisl. Praesent sed orci leo. Cras scelerisque tristique
              turpis, mattis aliquet nisi fringilla vitae.
            </va-accordion-item>
          </va-accordion>
          <h2 id="establishing-representation">Establishing Representation</h2>
          <p>
            When a Veteran seeks support from a representative, they can sign
            into VA.gov and submit VA Form 21-22 online using the Appoint a Rep
            tool. When a representative signs into ARP, the representative can
            accept or decline any requests to organizations they are accredited
            with. We encourage you to test the online Appoint a Rep tool
            on VA.gov to understand the Veteran experience.
          </p>
          <va-accordion>
            <va-accordion-item
              header="Receiving representation requests in the portal"
              id="section-twelve"
              level="3"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              augue erat, finibus a egestas ac, sodales sit amet diam. Aliquam
              efficitur est sit amet blandit malesuada. Maecenas sit amet ex non
              nulla fringilla maximus id quis justo. Vivamus interdum ante
              tellus, eu convallis urna placerat ut. Ut scelerisque maximus
              neque, ac elementum leo ultricies nec. Duis sagittis consequat
              orci eu lacinia. Donec sodales nulla ac tellus venenatis, sit amet
              pulvinar nisl pulvinar. Duis enim mauris, egestas sit amet
              pulvinar non, pulvinar ac nulla. Vivamus consequat ante ac magna
              dapibus sagittis. Nulla molestie urna aliquet, viverra odio eget,
              fermentum nisl. Praesent sed orci leo. Cras scelerisque tristique
              turpis, mattis aliquet nisi fringilla vitae.
            </va-accordion-item>
            <va-accordion-item
              header="Accepting and declining requests"
              id="section-thirteen"
              level="3"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              augue erat, finibus a egestas ac, sodales sit amet diam. Aliquam
              efficitur est sit amet blandit malesuada. Maecenas sit amet ex non
              nulla fringilla maximus id quis justo. Vivamus interdum ante
              tellus, eu convallis urna placerat ut. Ut scelerisque maximus
              neque, ac elementum leo ultricies nec. Duis sagittis consequat
              orci eu lacinia. Donec sodales nulla ac tellus venenatis, sit amet
              pulvinar nisl pulvinar. Duis enim mauris, egestas sit amet
              pulvinar non, pulvinar ac nulla. Vivamus consequat ante ac magna
              dapibus sagittis. Nulla molestie urna aliquet, viverra odio eget,
              fermentum nisl. Praesent sed orci leo. Cras scelerisque tristique
              turpis, mattis aliquet nisi fringilla vitae.
            </va-accordion-item>
            <va-accordion-item
              header="Getting access to this feature"
              id="section-fourteen"
              level="3"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              augue erat, finibus a egestas ac, sodales sit amet diam. Aliquam
              efficitur est sit amet blandit malesuada. Maecenas sit amet ex non
              nulla fringilla maximus id quis justo. Vivamus interdum ante
              tellus, eu convallis urna placerat ut. Ut scelerisque maximus
              neque, ac elementum leo ultricies nec. Duis sagittis consequat
              orci eu lacinia. Donec sodales nulla ac tellus venenatis, sit amet
              pulvinar nisl pulvinar. Duis enim mauris, egestas sit amet
              pulvinar non, pulvinar ac nulla. Vivamus consequat ante ac magna
              dapibus sagittis. Nulla molestie urna aliquet, viverra odio eget,
              fermentum nisl. Praesent sed orci leo. Cras scelerisque tristique
              turpis, mattis aliquet nisi fringilla vitae.
            </va-accordion-item>
          </va-accordion>
          <h2 id="searching-for-claimants-you-represent">
            Searching for claimants you represent
          </h2>
          <p>
            With the search function, you can find any claimant represented by
            an organization you are accredited with, and those who have
            requested POA.
          </p>
          <va-accordion>
            <va-accordion-item
              header="How to search using the tool"
              id="section-fifteen"
              level="3"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              augue erat, finibus a egestas ac, sodales sit amet diam. Aliquam
              efficitur est sit amet blandit malesuada. Maecenas sit amet ex non
              nulla fringilla maximus id quis justo. Vivamus interdum ante
              tellus, eu convallis urna placerat ut. Ut scelerisque maximus
              neque, ac elementum leo ultricies nec. Duis sagittis consequat
              orci eu lacinia. Donec sodales nulla ac tellus venenatis, sit amet
              pulvinar nisl pulvinar. Duis enim mauris, egestas sit amet
              pulvinar non, pulvinar ac nulla. Vivamus consequat ante ac magna
              dapibus sagittis. Nulla molestie urna aliquet, viverra odio eget,
              fermentum nisl. Praesent sed orci leo. Cras scelerisque tristique
              turpis, mattis aliquet nisi fringilla vitae.
            </va-accordion-item>
            <va-accordion-item
              header="Does the search function check for limited representation?"
              id="section-sixteen"
              level="3"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              augue erat, finibus a egestas ac, sodales sit amet diam. Aliquam
              efficitur est sit amet blandit malesuada. Maecenas sit amet ex non
              nulla fringilla maximus id quis justo. Vivamus interdum ante
              tellus, eu convallis urna placerat ut. Ut scelerisque maximus
              neque, ac elementum leo ultricies nec. Duis sagittis consequat
              orci eu lacinia. Donec sodales nulla ac tellus venenatis, sit amet
              pulvinar nisl pulvinar. Duis enim mauris, egestas sit amet
              pulvinar non, pulvinar ac nulla. Vivamus consequat ante ac magna
              dapibus sagittis. Nulla molestie urna aliquet, viverra odio eget,
              fermentum nisl. Praesent sed orci leo. Cras scelerisque tristique
              turpis, mattis aliquet nisi fringilla vitae.
            </va-accordion-item>
          </va-accordion>
          <h2 id="submitting-va-forms">Submitting VA forms</h2>
          <p>
            After establishing representation, you can submit forms through the
            portal. The portal will check to make sure you hold POA with the
            claimant prior to submitting.
          </p>
          <va-accordion>
            <va-accordion-item
              header="Upload and submit completed pdfs"
              id="section-seventeen"
              level="3"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              augue erat, finibus a egestas ac, sodales sit amet diam. Aliquam
              efficitur est sit amet blandit malesuada. Maecenas sit amet ex non
              nulla fringilla maximus id quis justo. Vivamus interdum ante
              tellus, eu convallis urna placerat ut. Ut scelerisque maximus
              neque, ac elementum leo ultricies nec. Duis sagittis consequat
              orci eu lacinia. Donec sodales nulla ac tellus venenatis, sit amet
              pulvinar nisl pulvinar. Duis enim mauris, egestas sit amet
              pulvinar non, pulvinar ac nulla. Vivamus consequat ante ac magna
              dapibus sagittis. Nulla molestie urna aliquet, viverra odio eget,
              fermentum nisl. Praesent sed orci leo. Cras scelerisque tristique
              turpis, mattis aliquet nisi fringilla vitae.
            </va-accordion-item>
            <va-accordion-item
              header="Supported forms"
              id="section-eighteen"
              level="3"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              augue erat, finibus a egestas ac, sodales sit amet diam. Aliquam
              efficitur est sit amet blandit malesuada. Maecenas sit amet ex non
              nulla fringilla maximus id quis justo. Vivamus interdum ante
              tellus, eu convallis urna placerat ut. Ut scelerisque maximus
              neque, ac elementum leo ultricies nec. Duis sagittis consequat
              orci eu lacinia. Donec sodales nulla ac tellus venenatis, sit amet
              pulvinar nisl pulvinar. Duis enim mauris, egestas sit amet
              pulvinar non, pulvinar ac nulla. Vivamus consequat ante ac magna
              dapibus sagittis. Nulla molestie urna aliquet, viverra odio eget,
              fermentum nisl. Praesent sed orci leo. Cras scelerisque tristique
              turpis, mattis aliquet nisi fringilla vitae.
            </va-accordion-item>
            <va-accordion-item
              header="In SEP, I was able to submit a 21-686c and establish dependents within 24 hours. Will I be able to do this in the portal?"
              id="section-nineteen"
              level="3"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              augue erat, finibus a egestas ac, sodales sit amet diam. Aliquam
              efficitur est sit amet blandit malesuada. Maecenas sit amet ex non
              nulla fringilla maximus id quis justo. Vivamus interdum ante
              tellus, eu convallis urna placerat ut. Ut scelerisque maximus
              neque, ac elementum leo ultricies nec. Duis sagittis consequat
              orci eu lacinia. Donec sodales nulla ac tellus venenatis, sit amet
              pulvinar nisl pulvinar. Duis enim mauris, egestas sit amet
              pulvinar non, pulvinar ac nulla. Vivamus consequat ante ac magna
              dapibus sagittis. Nulla molestie urna aliquet, viverra odio eget,
              fermentum nisl. Praesent sed orci leo. Cras scelerisque tristique
              turpis, mattis aliquet nisi fringilla vitae.
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
                unable to resolve login issues, or if you are a VSO manager and
                would like access to the Representation Request feature for your
                organization:&nbsp;
                <a href="mailto:RepresentativePortalHelp@va.gov">
                  RepresentativePortalHelp@va.gov
                </a>
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
