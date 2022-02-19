import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';

export default function App() {
  return (
    <div>
  <Breadcrumbs>
      <a href="http://wwww.link.com">
        Home
      </a>
      <a href="http://wwww.link.com">
        Level One
      </a>
      <a href="http://wwww.link.com">
        Level Two
      </a>
      <a href="http://wwww.link.com">
        1095-B Tax document
      </a>
    </Breadcrumbs>
    <div>
      <button type="button" class="va-btn-sidebarnav-trigger" aria-controls="va-detailpage-sidebar">
        <span>
          <b>More in this section</b>
          <svg xmlns="http://www.w3.org/2000/svg" width="444.819" height="444.819" viewBox="0 0 444.819 444.819"><path fill="#ffffff" d="M352.025 196.712L165.885 10.848C159.028 3.615 150.468 0 140.185 0s-18.84 3.62-25.696 10.848l-21.7 21.416c-7.045 7.043-10.567 15.604-10.567 25.692 0 9.897 3.52 18.56 10.566 25.98L231.544 222.41 92.785 361.168c-7.04 7.043-10.563 15.604-10.563 25.693 0 9.9 3.52 18.566 10.564 25.98l21.7 21.417c7.043 7.043 15.612 10.564 25.697 10.564 10.09 0 18.656-3.52 25.697-10.564L352.025 248.39c7.046-7.423 10.57-16.084 10.57-25.98.002-10.09-3.524-18.655-10.57-25.698z"></path></svg>
        </span>
      </button>
    </div>
    <div class="vads-l-grid-container large-screen:vads-u-padding-x--0 vads-u-padding-y--2">
      <div class="vads-l-row vads-u-margin-x--neg2p5">
        <div class="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4 large-screen:vads-l-col--3">
          <nav class="va-sidebarnav vads-u-width--full" id="va-detailpage-sidebar">
            <div>
              <button type="button" aria-label="Close this menu" class="va-btn-close-icon va-sidebarnav-close"></button>
              <div class="left-side-nav-title">
                <strong>Section Name</strong>
              </div>
              <ul class="usa-accordion">
                <li>
                  <button class="usa-accordion-button" aria-expanded="false" aria-controls="a1">
                    Nav section
                  </button>
                  <div id="a1" class="usa-accordion-content" aria-hidden="true">
                    <ul class="usa-sidenav-list">
                      <li>
                        <a href="http://wwww.link.com">Link</a>
                      </li>
                      <li>
                        <a href="http://wwww.link.com">Link</a>
                      </li>
                      <li>
                        <a href="http://wwww.link.com">Link</a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li>
                  <button class="usa-accordion-button" aria-expanded="true" aria-controls="a2">
                    Second nav section
                  </button>
                  <div id="a2" class="usa-accordion-content" aria-hidden="false">
                    <ul class="usa-sidenav-list">
                      <li>
                        <a href="http://wwww.link.com">Link</a>
                      </li>
                      <li class="active-level">
                        <a class="usa-current" href="http://wwww.link.com">Current section</a>
                      </li>
                      <li>
                        <a href="http://wwww.link.com">Link</a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li>
                  <button class="usa-accordion-button" aria-expanded="false" aria-controls="a3">
                    Third nav section
                  </button>
                  <div id="a3" class="usa-accordion-content" aria-hidden="true">
                    <ul class="usa-sidenav-list">
                      <li>
                        <a href="http://wwww.link.com">Link</a>
                      </li>
                      <li>
                        <a href="http://wwww.link.com">Link</a>
                      </li>
                      <li>
                        <a href="http://wwww.link.com">Link</a>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div class="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8 large-screen:vads-l-col--9">
          <h1 className="vads-u-font-size--h1">1095-B tax document (proof of health coverage)</h1>
          <p className="va-introtext">
            The 1095-B is an IRS tax document that shows the period that you had health coverage through the VA 
            for the tax year. Due to changes in the <a href="http://wwww.link.com">Affordable Care Act</a>, this document is no longer required 
            to file your federal taxes; however some states may still require proof of health coverage. 
          </p>
          <p>*States requiring proof of coverage as of January 2022: Massachusetts, New Jersey, Vermont, California, Rhode Island and District of Columbia (Washington D.C.)</p>
          <h2 className="vads-u-font-size--h2">Download your 1095-B</h2>
          <p className="vads-u-margin-bottom--5"> <i className="fas fa-download download-icon vads-u-color--primary-darker" role="presentation"></i>&nbsp;<a href="http://wwww.link.com" className="download-text">Download current 1095-B tax document (PDF) </a></p>
          <span className="vads-u-line-height--3 vads-u-display--block"><strong>Related to:</strong> Health care</span>
          <span className="vads-u-line-height--3 vads-u-display--block"><strong>Document last updated:</strong> November 5, 2021</span>
          <h2 className="vads-u-font-size--h2 vads-u-border-bottom--3px vads-u-border-color--primary">Need help?</h2>
          <p><span className="vads-u-font-weight--bold">If your address or other information is incorrect or needs to be updated on your 1095-B</span>.
            Call the enrollment center toll-free at <a href="http://wwww.link.com">1-877-222-VETS (8387)</a> Monday through Friday, 8:00 am until 8:00 pm (EST). 
            Changes may take up to 10 business days to process and for you to receive your updated document.</p>
          <p><span className="vads-u-font-weight--bold">If you’re having trouble viewing your 1095-B.</span>  To view your 1095-B after download, 
            you may need the latest version of Adobe Acrobat Reader.  It’s free to download. <a href="http://wwww.link.com">Get Acrobat Reader for free
             from Adobe</a>.</p>
        </div>
      </div>
    </div>
  </div>
    );
}
