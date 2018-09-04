export default `
<div class="consolidated">
  <header class="header">
    <div class="incompatible-browser-warning">
      <div class="row full">
        <div class="small-12">
          Your browser is out of date. To use this website, please <a href="https://whatbrowser.org/">update your browser</a> or use a different device.
        </div>
      </div>
    </div>

    <div class="va-notice--banner">
      <div class="va-notice--banner-inner">
  <div class="usa-banner">
    <div class="usa-accordion">
      <div class="usa-banner-header">
        <div class="usa-grid usa-banner-inner">
        <img src="/img/tiny-usa-flag.png" alt="U.S. flag">
        <p>An official website of the United States government</p>
        <button id="usa-banner-toggle" class="usa-accordion-button usa-banner-button" aria-expanded="false" aria-controls="gov-banner">
          <span class="usa-banner-button-text">Here’s how you know</span>
        </button>
        </div>
      </div>
      <div class="usa-banner-content usa-grid usa-accordion-content" id="gov-banner" aria-hidden="true">
        <div class="usa-banner-guidance-gov usa-width-one-half">
          <img class="usa-banner-icon usa-media_block-img" src="/img/icon-dot-gov.svg" alt="Dot gov">
          <div class="usa-media_block-body">
            <p>
              <strong>The .gov means it’s official.</strong>
              <br>
              Federal government websites often end in .gov or .mil. Before sharing sensitive information, make sure you're on a federal government site.
            </p>
          </div>
        </div>
        <div class="usa-banner-guidance-ssl usa-width-one-half">
          <img class="usa-banner-icon usa-media_block-img" src="/img/icon-https.svg" alt="SSL">
          <div class="usa-media_block-body">
            <p>
              <strong>The site is secure.</strong>
              <br> The <strong>https://</strong> ensures that you're connecting to the official website and that any information you provide is encrypted and sent securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
        <div class="va-crisis-line">
          <div class="va-flex">
            <button data-show="#modal-crisisline" class="va-crisis-line-button va-overlay-trigger">
              <span class="va-flex">
                <span class="vcl"></span>
                Get help from Veterans Crisis Line
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- /header alert box -->

    <div class="row va-flex" id="va-header-logo-menu">
      <div role="banner" class="va-header-logo-wrapper">
        <a href="/" class="va-header-logo" onClick="recordEvent({ event: 'nav-header-logo' });">
  <svg class="vets-logo" width="206" height="50" viewBox="0 0 206 50" xmlns="http://www.w3.org/2000/svg" pointer-events="none"><title>Vets dot gov from the U S Department of Veteran Affairs</title><g fill="none" fill-rule="evenodd"><g class="vets-logo-vetsdotgov"><path d="M194.04 37h3.84l6.88-19.44h-3.24l-3.68 11.04c-.56 1.92-1.2 3.88-1.76 5.72h-.16c-.6-1.84-1.24-3.8-1.8-5.72l-3.68-11.04h-3.4l7 19.44zM167.32 27.32c0 6.44 4.24 10.16 9 10.16s9-3.72 9-10.16c0-6.52-4.24-10.24-9-10.24s-9 3.72-9 10.24zm3.4 0c0-4.48 2.28-7.52 5.6-7.52 3.36 0 5.6 3.04 5.6 7.52 0 4.44-2.24 7.44-5.6 7.44-3.32 0-5.6-3-5.6-7.44zM148.28 40.72c0 3.36 3.28 5.24 8.04 5.24 6.04 0 9.84-3.12 9.84-6.72 0-3.24-2.28-4.64-6.8-4.64h-3.76c-2.64 0-3.44-.88-3.44-2.12 0-1.08.56-1.72 1.24-2.32.88.44 1.96.68 2.92.68 3.96 0 7.12-2.6 7.12-6.76 0-1.64-.68-3.12-1.6-4h4v-2.52h-6.76c-.72-.28-1.68-.48-2.76-.48-3.96 0-7.32 2.68-7.32 6.92 0 2.32 1.24 4.2 2.52 5.24v.16c-1 .68-2.12 1.96-2.12 3.6 0 1.52.76 2.56 1.72 3.16v.16c-1.76 1.2-2.84 2.76-2.84 4.4zm8.04-12.08c-2.24 0-4.12-1.8-4.12-4.64s1.84-4.52 4.12-4.52c2.28 0 4.12 1.68 4.12 4.52s-1.88 4.64-4.12 4.64zm-5.16 11.64c0-1.12.6-2.28 2-3.28.84.24 1.76.32 2.52.32h3.36c2.52 0 3.92.6 3.92 2.4 0 2.04-2.44 3.96-6.16 3.96-3.52 0-5.64-1.32-5.64-3.4zM137.52 33.8c0 2.08 1.52 3.68 3.56 3.68s3.56-1.6 3.56-3.68c0-2.12-1.52-3.72-3.56-3.72s-3.56 1.6-3.56 3.72zM118.8 34.72c2 1.64 5 2.76 7.6 2.76 5.32 0 8.16-2.8 8.16-6.4 0-3.64-2.84-5.04-5.36-5.96-2.04-.76-3.88-1.24-3.88-2.52 0-1 .72-1.56 2.24-1.56 1.4 0 2.76.64 4.2 1.68l2.64-3.52c-1.72-1.28-3.96-2.52-7-2.52-4.6 0-7.6 2.52-7.6 6.2 0 3.28 2.84 4.92 5.24 5.84 2.04.8 4.04 1.4 4.04 2.72 0 1.04-.76 1.68-2.52 1.68-1.68 0-3.32-.72-5.12-2.08l-2.64 3.68zM106.64 29.8c0 4.6 1.92 7.68 6.84 7.68 1.92 0 3.36-.4 4.4-.72l-.92-4.28c-.52.2-1.24.4-1.88.4-1.56 0-2.56-.92-2.56-3.16v-7.96h4.76v-4.6h-4.76v-5.28h-4.88l-.68 5.28-3.04.24v4.36h2.72v8.04zM85.28 27.08c0 6.56 4.36 10.4 10.04 10.4 2.36 0 5-.84 7.04-2.24l-1.96-3.56c-1.44.88-2.8 1.32-4.28 1.32-2.64 0-4.64-1.32-5.16-4.32h11.88c.12-.48.24-1.44.24-2.48 0-5.4-2.8-9.52-8.44-9.52-4.76 0-9.36 3.96-9.36 10.4zm5.64-2.04c.4-2.64 2-3.88 3.84-3.88 2.36 0 3.32 1.6 3.32 3.88h-7.16zM70.56 37h7.08l7.88-26.08h-6.04L76.4 23.08c-.76 2.84-1.28 5.48-2.08 8.36h-.16c-.8-2.88-1.32-5.52-2.08-8.36l-3.16-12.16h-6.24L70.56 37zM53 5h1v40h-1z"/></g><g class="vets-logo-va"><path d="M38.12 37h6.24l-8.2-26.08h-7.04L20.92 37h6l1.6-6.2h8l1.6 6.2zm-8.4-10.8l.64-2.4c.72-2.6 1.44-5.64 2.04-8.4h.16c.72 2.72 1.4 5.8 2.12 8.4l.64 2.4h-5.6zM9.56 37h7.08l7.88-26.08h-6.04L15.4 23.08c-.76 2.84-1.28 5.48-2.08 8.36h-.16c-.8-2.88-1.32-5.52-2.08-8.36L7.92 10.92H1.68L9.56 37z"/></g></g></svg>
        </a>
      </div>
        <div id="vetnav-controls">
          <button aria-controls="vetnav" aria-expanded="false" hidden type="button" class="vetnav-controller-close">
            <span class="va-flex">
  <svg width="16" height="16" viewBox="0 0 49 49" xmlns="http://www.w3.org/2000/svg" pointer-events="none"><title>Close</title><path d="M48.152 39.402c0 1.07-.375 1.982-1.125 2.732l-5.465 5.464c-.75.75-1.66 1.125-2.732 1.125-1.07 0-1.982-.375-2.732-1.125L24.286 35.786 12.473 47.598c-.75.75-1.66 1.125-2.732 1.125-1.07 0-1.98-.375-2.73-1.125l-5.465-5.464c-.75-.75-1.125-1.66-1.125-2.732 0-1.072.375-1.982 1.125-2.732l11.812-11.813L1.545 13.045c-.75-.75-1.125-1.66-1.125-2.732C.42 9.24.795 8.33 1.545 7.58L7.01 2.116C7.76 1.366 8.67.99 9.74.99c1.073 0 1.983.376 2.733 1.126L24.286 13.93 36.098 2.115c.75-.75 1.66-1.125 2.732-1.125 1.072 0 1.982.376 2.733 1.126l5.464 5.464c.75.75 1.125 1.66 1.125 2.732 0 1.072-.375 1.983-1.125 2.733L35.214 24.857 47.027 36.67c.75.75 1.125 1.66 1.125 2.732z" /></svg>            Close
            </span>
          </button>
          <button aria-controls="vetnav" type="button" aria-expanded="false" class="vetnav-controller-open">
            <span class="va-flex">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 444.8 444.8" style="pointer-events:none;"><path d="M248.1 352L434 165.9c7.2-6.9 10.8-15.4 10.8-25.7 0-10.3-3.6-18.8-10.8-25.7l-21.4-21.7c-7-7-15.6-10.6-25.7-10.6-9.9 0-18.6 3.5-26 10.6L222.4 231.5 83.7 92.8c-7-7-15.6-10.6-25.7-10.6-9.9 0-18.6 3.5-26 10.6l-21.4 21.7c-7 7-10.6 15.6-10.6 25.7s3.5 18.7 10.6 25.7L196.4 352c7.4 7 16.1 10.6 26 10.6 10.1 0 18.7-3.5 25.7-10.6z"/></svg>            Menu
            </span>
          </button>
        </div>

      <div id="login-root" class="vet-toolbar"></div>


      <div class="login-container">
    <div class="row va-flex">
      <nav id="vetnav" role="navigation" hidden>
        <ul id="vetnav-menu" role="menubar">
          <li><a href="/" class="vetnav-level1" role="menuitem">Home</a></li>

          <!-- explore and apply for benefits -->
          <li>
            <button
              aria-controls="vetnav-explore"
              role="button"
              aria-haspopup="true"
              class="vetnav-level1"
              onClick="recordEvent({ event: 'nav-header-top-level' });">Explore and Apply for Benefits</button>
            <div id="vetnav-explore" class="vetnav-panel" role="none" hidden>
              <ul role="menu" aria-label="Explore benefits">
                <li>
                  <button
                    class="vetnav-level2"
                    role="button"
                    aria-haspopup="true"
                    aria-controls="vetnav-disability"
                    onClick="recordEvent({ event: 'nav-header-second-level' });">Disability</button>
                  <ul
                    class="vetnav-panel vetnav-panel--submenu"
                    id="vetnav-disability"
                    role="menu"
                    aria-label="Disability"
                    hidden>
                    <li>
                      <button
                        class="back-button"
                        aria-controls="vetnav-disability">Back to Menu</button>
                      <div class="vetnav-level2-heading">Disability</div>
                    </li>
                    <li><a href="/disability-benefits/" onClick="reportHeaderNav('Explore Benefits->Disabilty');">Disability Benefits Overview</a></li>
                    <li><a href="/disability-benefits/eligibility/" onClick="reportHeaderNav('Explore Benefits->Disabilty');">Eligibility</a></li>
                    <li><a href="/disability-benefits/apply/" onClick="reportHeaderNav('Explore Benefits->Disabilty');">How to Apply for Disability Benefits</a></li>
                    <li><a href="/disability-benefits/conditions/" onClick="reportHeaderNav('Explore Benefits->Disabilty');">Conditions</a></li>
                    <li><a class="login-required" href="/track-claims/" onClick="reportHeaderNav('Explore Benefits->Disabilty');">Track Your Claims and Appeals</a></li>
                    <li><a href="/disability-benefits/claims-appeal/" onClick="reportHeaderNav('Explore Benefits->Disabilty');">Appeals Process</a></li>
                    <li><a class="usa-button va-button-primary va-external--light" href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=disability-compensation" onClick="reportHeaderNav('Explore Benefits->Disabilty');">Go to eBenefits to Apply <svg width="93" height="90" viewBox="0 0 93 90" xmlns="http://www.w3.org/2000/svg" pointer-events="none" style="pointer-events:none;"><title>You will leave Vets.gov</title><path d="M68 39H28v10h40v11l25-16-25-16v11zM78 6.01C78 2.694 75.318 0 72.01 0H5.99C2.686 0 0 2.69 0 6.01v77.98C0 87.306 2.682 90 5.99 90h66.02c3.305 0 5.99-2.69 5.99-6.01V73H68v8H10V10h58v8h10V6.01z" fill="#FFF" fill-rule="evenodd"/></svg></a></li>
                  </ul>
                </li>

                <li>
                  <button
                    class="vetnav-level2"
                    role="button"
                    aria-haspopup="true"
                    aria-controls="vetnav-healthcare"
                    onClick="recordEvent({ event: 'nav-header-second-level' });">Health Care</button>
                  <ul
                    class="vetnav-panel vetnav-panel--submenu"
                    id="vetnav-healthcare"
                    role="menu"
                    aria-label="Health care"
                    hidden>
                    <li>
                      <button
                        class="back-button"
                        aria-controls="vetnav-healthcare">Back to Menu</button>
                      <div class="vetnav-level2-heading">Health Care</div>
                    </li>
                    <li><a href="/health-care/" onClick="reportHeaderNav('Explore Benefits->Health Care');">Health Care Benefits Overview</a></li>
                    <li><a href="/health-care/eligibility/" onClick="reportHeaderNav('Explore Benefits->Health Care');">Eligibility</a></li>
                    <li><a href="/health-care/apply/" onClick="reportHeaderNav('Explore Benefits->Health Care');">How to Apply for Health Care</a></li>
                    <li><a href="/health-care/health-conditions/" onClick="reportHeaderNav('Explore Benefits->Health Care');">Health Needs and Conditions</a></li>
                    <li><a class="login-required" href="/health-care/prescriptions/" onClick="reportHeaderNav('Explore Benefits->Health Care');">Refill Prescriptions</a></li>
                    <li><a class="login-required" href="/health-care/messaging/" onClick="reportHeaderNav('Explore Benefits->Health Care');">Message Your Health Care Team</a></li>
                    <li><a href="/health-care/health-records/" onClick="reportHeaderNav('Explore Benefits->Health Care');">Get Your VA Health Records</a></li>
                    <li><a id="google-optimize-health-care-apply" href="/health-care/apply/application/" class="usa-button va-button-primary" onClick="reportHeaderNav('Explore Benefits->Health Care');">Apply Now</a></li>
                  </ul>
                </li>

                <li>
                  <button
                    class="vetnav-level2"
                    role="button"
                    aria-haspopup="true"
                    aria-controls="vetnav-edu"
                    onClick="recordEvent({ event: 'nav-header-second-level' });">Education and Training</button>
                  <ul
                    class="vetnav-panel vetnav-panel--submenu"
                    id="vetnav-edu"
                    role="menu"
                    aria-label="Education and training"
                    hidden>
                    <li>
                      <button
                        class="back-button"
                        aria-controls="vetnav-edu">Back to Menu</button>
                      <div class="vetnav-level2-heading">Education and Training</div>
                    </li>
                    <li><a href="/education/" onClick="reportHeaderNav('Explore Benefits->Education Training');">Education and Training Benefits Overview</a></li>
                    <li><a href="/education/eligibility/" onClick="reportHeaderNav('Explore Benefits->Education Training');">Eligibility</a></li>
                    <li><a href="/education/apply/" onClick="reportHeaderNav('Explore Benefits->Education Training');">How to Apply for Education Benefits</a></li>
                    <li><a href="/education/gi-bill/" onClick="reportHeaderNav('Explore Benefits->Education Training');">GI Bill Programs</a></li>
                    <li><a href="/employment/vocational-rehab-and-employment" onClick="reportHeaderNav('Explore Benefits->Vocational Rehab and Employment');">Vocational Rehabilitation &amp; <br>Employment (VR&amp;E)</a></li>
                    <li><a href="/gi-bill-comparison-tool/" onClick="reportHeaderNav('Explore Benefits->Education Training');">Compare GI Bill Benefits</a></li>
                    <li><a href="/education/apply/" class="usa-button va-button-primary" onClick="reportHeaderNav('Explore Benefits->Education Training');">Apply Now</a></li>
                  </ul>
                </li>

                <li>
                  <button
                    class="vetnav-level2"
                    role="button"
                    aria-haspopup="true"
                    aria-controls="vetnav-housing"
                    onClick="recordEvent({ event: 'nav-header-second-level' });">Housing Assistance</button>
                  <ul
                    class="vetnav-panel vetnav-panel--submenu"
                    id="vetnav-housing"
                    role="menu"
                    aria-label="Housing assistance"
                    hidden>
                  <li>
                    <button
                    class="vetnav-level2 back-button"
                    aria-controls="vetnav-housing">Back to Menu</button>
                    <div class="vetnav-level2-heading">Housing Assistance</div>
                    <li><a href="/housing-assistance/" onClick="reportHeaderNav('Explore Benefits->Housing Assistance');">Housing Assistance Overview</a></li>
                    <li><a href="/housing-assistance/home-loans/" onClick="reportHeaderNav('Explore Benefits->Housing Assistance');">Home Loans</a></li>
                    <li><a href="/housing-assistance/adaptive-housing-grants/" onClick="reportHeaderNav('Explore Benefits->Housing Assistance');">Adaptive Housing Grants</a></li>
                  </ul>
                </li>

                <li>
                  <button
                    class="vetnav-level2"
                    role="button"
                    aria-haspopup="true"
                    aria-controls="vetnav-careers"
                    onClick="recordEvent({ event: 'nav-header-second-level' });">Careers and Employment</button>
                  <ul
                    class="vetnav-panel vetnav-panel--submenu"
                    id="vetnav-careers"
                    role="menu"
                    aria-label="Careers and employment"
                    hidden>
                    <li>
                      <button
                      class="vetnav-level2 back-button"
                      aria-controls="vetnav-careers">Back to Menu</button>
                      <div class="vetnav-level2-heading">Careers and Employment</div>
                    </li>
                    <li><a href="/employment/" onClick="reportHeaderNav('Explore Benefits->Careers Employment');">Careers and Employment Overview</a></li>
                    <!--<li><a href="/employment/" onClick="reportHeaderNav('Explore Benefits->Careers Employment');">Find a Job / Hire a Veteran</a></li>-->
                    <li><a href="/employment/vocational-rehab-and-employment/" onClick="reportHeaderNav('Explore Benefits->Careers Employment');">Vocational Rehabilitation &amp; <br>Employment (VR&amp;E)</a></li>
                    <li><a href="/employment/job-seekers/register-your-business/" onClick="reportHeaderNav('Explore Benefits->Careers Employment');">Small Business Support</a></li>
                    <li><a href="/employment/job-seekers/family-members/" onClick="reportHeaderNav('Explore Benefits->Careers Employment');">Resources for Military and Veteran<br>Family Members</a></li>
                  </ul>
                </li>

                <li>
                  <button
                    class="vetnav-level2"
                    role="button"
                    aria-haspopup="true"
                    aria-controls="vetnav-lifeinsurance"
                    onClick="recordEvent({ event: 'nav-header-second-level' });">Life Insurance</button>
                  <ul
                    class="vetnav-panel vetnav-panel--submenu"
                    id="vetnav-lifeinsurance"
                    role="menu"
                    aria-label="Life insurance"
                    hidden>
                    <li>
                      <button
                        class="back-button"
                        aria-controls="vetnav-lifeinsurance">Back to Menu</button>
                      <div class="vetnav-level2-heading">Life Insurance</div>
                    </li>
                    <li><a href="/life-insurance/" onClick="reportHeaderNav('Explore Benefits->Life Insurance');">Life Insurance Overview</a></li>
                    <li><a href="/life-insurance/options-and-eligibility/" onClick="reportHeaderNav('Explore Benefits->Life Insurance');">Options and Eligibility</a></li>
                    <li><a href="/life-insurance/disabled-and-terminally-ill/" onClick="reportHeaderNav('Explore Benefits->Life Insurance');">Totally Disabled or Terminally Ill</a></li>
                    <li><a href="/life-insurance/manage-your-policy/" onClick="reportHeaderNav('Explore Benefits->Life Insurance');">Managing Your Policy</a></li>
                  </ul>
                </li>

                <li>
                  <button
                    class="vetnav-level2"
                    role="button"
                    aria-haspopup="true"
                    aria-controls="vetnav-pension"
                    onClick="recordEvent({ event: 'nav-header-second-level' });">Pension</button>
                  <ul
                    class="vetnav-panel vetnav-panel--submenu"
                    id="vetnav-pension"
                    role="menu"
                    aria-label="Pension"
                    hidden>
                    <li>
                      <button
                      class="vetnav-level2 back-button"
                      aria-controls="vetnav-pension">Back to Menu</button>
                      <div class="vetnav-level2-heading">Pension</div>
                    <li><a href="/pension/" onClick="reportHeaderNav('Explore Benefits->Pension');">Pension Benefits Overview</a></li>
                    <li><a href="/pension/eligibility/" onClick="reportHeaderNav('Explore Benefits->Pension');">Eligibility</a></li>
                    <li><a href="/pension/apply/" onClick="reportHeaderNav('Explore Benefits->Pension');">How to Apply for a Veterans Pension</a></li>
                    <li><a href="/pension/survivors-pension/" onClick="reportHeaderNav('Explore Benefits->Pension');">How to Apply for a Survivors Pension</a></li>
                  </ul>
                </li>

                <li>
                  <button
                    class="vetnav-level2"
                    role="button"
                    aria-haspopup="true"
                    aria-controls="vetnav-burials"
                    onClick="recordEvent({ event: 'nav-header-second-level' });">Burials and Memorials</button>
                  <ul
                    class="vetnav-panel vetnav-panel--submenu"
                    id="vetnav-burials"
                    role="menu"
                    aria-label="Burials and memorials"
                    hidden>
                    <li>
                      <button
                        class="back-button"
                        aria-controls="vetnav-burials">Back to Menu</button>
                      <div class="vetnav-level2-heading">Burials and Memorials</div>
                    </li>
                    <li><a href="/burials-and-memorials/" onClick="reportHeaderNav('Explore Benefits->Burials Memorials');">Burials and Memorials Overview</a></li>
                    <li><a href="/burials-and-memorials/eligibility/" onClick="reportHeaderNav('Explore Benefits->Burials Memorials');">Eligibility</a></li>
                    <li><a href="/burials-and-memorials/burial-planning/" onClick="reportHeaderNav('Explore Benefits->Burials Memorials');">Plan a Burial</a></li>
                    <li><a href="/burials-and-memorials/pre-need/" onClick="reportHeaderNav('Explore Benefits->Burials Memorials');">Plan ahead for your own burial by <br> applying for pre-need eligibility</a></li>
                    <li><a href="/burials-and-memorials/survivor-and-dependent-benefits/" onClick="reportHeaderNav('Explore Benefits->Burials Memorials');">Allowances and Survivor Compensation</a></li>
                    <li><a href="/burials-and-memorials/find-a-cemetery/" onClick="reportHeaderNav('Explore Benefits->Burials Memorials');">Find a Cemetery</a></li>
                  </ul>
                </li>
                <li><a href="/families-caregivers/" class="vetnav-level2 vetnav-level2-link vetnav-trigger">Family and Caregiver Benefits</a></li>
              </ul>
            </div>
          </li>


          <li>
            <button
              class="vetnav-level1"
              role="button"
              aria-controls="vetnav-benefits"
              aria-haspopup="true"
              onClick="recordEvent({ event: 'nav-header-top-level' });">Manage Your Health and Benefits</button>
            <div class="vetnav-panel" id="vetnav-benefits" hidden>
              <ul role="menu" aria-label="Manage your health and benefits">
                <li><a class="login-required" href="/track-claims" onClick="reportHeaderNav('Manage Health and Benefits');">Track Your Claims and Appeals</a></li>
                <li><a class="login-required" href="/health-care/prescriptions" onClick="reportHeaderNav('Manage Health and Benefits');">Refill Prescriptions</a></li>
                <li><a class="login-required" href="/health-care/messaging" onClick="reportHeaderNav('Manage Health and Benefits');">Message Your Health Care Team</a></li>
                <li><a href="/health-care/schedule-an-appointment/" onClick="reportHeaderNav('Manage Health and Benefits');">Schedule a VA Appointment</a></li>
                <li><a href="/education/gi-bill/post-9-11/ch-33-benefit" onClick="reportHeaderNav('Manage Health and Benefits');">Check Post-9/11 GI Bill Benefits</a></li>
              </ul>
            </div>
          </li>

          <li>
            <button
              class="vetnav-level1"
              role="button"
              aria-controls="vetnav-records"
              aria-haspopup="true"
              onClick="recordEvent({ event: 'nav-header-top-level' });">Request Your Records<!--and ID--></button>
            <div class="vetnav-panel" id="vetnav-records" hidden>
              <ul role="menu" aria-label="Request your records and ID">
                <!--<li><a class="login-required" href="/veteran-id-card/how-to-get" onClick="reportHeaderNav('Request Your Records and ID');">Apply for a Veteran ID Card</a></li>-->
                <li><a href="/discharge-upgrade-instructions/" onClick="reportHeaderNav('Request Your Records and ID->Apply For Discharge Upgrade');">How to Apply for a Discharge Upgrade</a></li>
                <li><a href="/health-care/health-records/" onClick="reportHeaderNav('Request Your Records and ID->Health Care');">Get Your VA Health Records</a></li>
                <li><a href="/download-va-letters/" onClick="reportHeaderNav('Request Your Records and ID->Health Care');">Download Your VA Letters</a></li>
              </ul>
            </div>
          </li>


          <li><a href="/facilities/" class="vetnav-level1" onClick="reportHeaderNav('Find VA locations');">Find VA Locations</a></li>
        </ul>
      </nav>
    </div>
  </div>

  <script>
  function reportHeaderNav(navpath) {
    recordEvent({
      event: 'nav-header-link',
      'nav-path': navpath
    });
  }
  </script>
        </div>

  </header>
</div>
`;
