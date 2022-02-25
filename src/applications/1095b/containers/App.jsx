import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import { connect } from 'react-redux';

const App = ({ isLoggedIn }) => {
  let loginComponent;
  if (isLoggedIn) {
    loginComponent = (
      <va-alert close-btn-aria-label="Close notification" status="info" visible>
        <h3 slot="headline">Download your 1095-B</h3>
        <div>
          <p className="vads-u-margin-bottom--5">
            <span className="vads-u-line-height--3 vads-u-display--block">
              <strong>Related to:</strong> Health care
            </span>
            <span className="vads-u-line-height--3 vads-u-display--block">
              <strong>Document last updated:</strong> November 5, 2021
            </span>
          </p>
          <i
            className="fas fa-download download-icon vads-u-color--primary-alt-darkest"
            role="presentation"
          />
          &nbsp;
          <a
            href="http://localhost:3000/v0/tax_1095/download_pdf"
            className="download-text"
          >
            Download current 1095-B tax document (PDF){' '}
          </a>
        </div>
      </va-alert>
    );
  } else {
    loginComponent = (
      <va-alert
        close-btn-aria-label="Close notification"
        status="continue"
        visible
      >
        <h3 slot="headline">
          Please sign in to download your 1095-B tax document
        </h3>
        <div>
          Sign in with your existing ID.me, DS Logon, or My HealtheVet account.
          If you don’t have any of these accounts, you can create a free ID.me
          account now.
        </div>
        <button
          type="button"
          className="usa-button-primary va-button-primary vads-u-margin-top--2"
        >
          Sign in
        </button>
      </va-alert>
    );
  }
  return (
    <>
      <Breadcrumbs>
        <a href="http://wwww.link.com">Home</a>
        <a href="http://wwww.link.com">Level One</a>
        <a href="http://wwww.link.com">Level Two</a>
        <a href="http://wwww.link.com">1095-B Tax document</a>
      </Breadcrumbs>
      <div>
        <button
          type="button"
          className="va-btn-sidebarnav-trigger"
          aria-controls="va-detailpage-sidebar"
        >
          <span>
            <b>More in this section</b>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="444.819"
              height="444.819"
              viewBox="0 0 444.819 444.819"
            >
              <path
                fill="#ffffff"
                d="M352.025 196.712L165.885 10.848C159.028 3.615 150.468 0 140.185 0s-18.84 3.62-25.696 10.848l-21.7 21.416c-7.045 7.043-10.567 15.604-10.567 25.692 0 9.897 3.52 18.56 10.566 25.98L231.544 222.41 92.785 361.168c-7.04 7.043-10.563 15.604-10.563 25.693 0 9.9 3.52 18.566 10.564 25.98l21.7 21.417c7.043 7.043 15.612 10.564 25.697 10.564 10.09 0 18.656-3.52 25.697-10.564L352.025 248.39c7.046-7.423 10.57-16.084 10.57-25.98.002-10.09-3.524-18.655-10.57-25.698z"
              />
            </svg>
          </span>
        </button>
      </div>
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0 vads-u-padding-y--2">
        <div className="vads-l-row vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4 large-screen:vads-l-col--3">
            <nav
              className="va-sidebarnav vads-u-width--full"
              id="va-detailpage-sidebar"
            >
              <div>
                <button
                  type="button"
                  aria-label="Close this menu"
                  className="va-btn-close-icon va-sidebarnav-close"
                />
                <div className="left-side-nav-title">
                  <strong>Section Name</strong>
                </div>
                <ul className="usa-accordion">
                  <li>
                    <button
                      className="usa-accordion-button"
                      aria-expanded="false"
                      aria-controls="a1"
                    >
                      Nav section
                    </button>
                    <div
                      id="a1"
                      className="usa-accordion-content"
                      aria-hidden="true"
                    >
                      <ul className="usa-sidenav-list">
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
                    <button
                      className="usa-accordion-button"
                      aria-expanded="true"
                      aria-controls="a2"
                    >
                      Second nav section
                    </button>
                    <div
                      id="a2"
                      className="usa-accordion-content"
                      aria-hidden="false"
                    >
                      <ul className="usa-sidenav-list">
                        <li>
                          <a href="http://wwww.link.com">Link</a>
                        </li>
                        <li className="active-level">
                          <a
                            className="usa-current"
                            href="http://wwww.link.com"
                          >
                            Current section
                          </a>
                        </li>
                        <li>
                          <a href="http://wwww.link.com">Link</a>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <button
                      className="usa-accordion-button"
                      aria-expanded="false"
                      aria-controls="a3"
                    >
                      Third nav section
                    </button>
                    <div
                      id="a3"
                      className="usa-accordion-content"
                      aria-hidden="true"
                    >
                      <ul className="usa-sidenav-list">
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
          <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8 large-screen:vads-l-col--9">
            <h1 className="vads-u-font-size--h1">
              1095-B tax document (proof of health coverage)
            </h1>
            <p className="va-introtext">
              The 1095-B is an IRS tax document that shows the period that you
              had health coverage through the VA for the tax year. Due to
              changes in the{' '}
              <a href="http://wwww.link.com">Affordable Care Act</a>, this
              document is no longer required to file your federal taxes; however
              some states may still require proof of health coverage.
            </p>
            <p className="vads-u-margin-bottom--5">
              *States requiring proof of coverage as of January 2022:
              Massachusetts, New Jersey, Vermont, California, Rhode Island and
              District of Columbia (Washington D.C.)
            </p>
            {loginComponent}
            <h3 className="vads-u-font-size--h3 vads-u-border-bottom--3px vads-u-border-color--primary vads-u-margin-top--5">
              Need help?
            </h3>
            <p>
              <span className="vads-u-font-weight--bold">
                If your address or other information is incorrect or needs to be
                updated on your 1095-B
              </span>
              . Call the enrollment center toll-free at{' '}
              <a href="http://wwww.link.com">1-877-222-VETS (8387)</a> Monday
              through Friday, 8:00 am until 8:00 pm (EST). Changes may take up
              to 10 business days to process and for you to receive your updated
              document.
            </p>
            <p>
              <span className="vads-u-font-weight--bold">
                If you’re having trouble viewing your 1095-B.
              </span>{' '}
              To view your 1095-B after download, you may need the latest
              version of Adobe Acrobat Reader. It’s free to download.{' '}
              <a href="http://wwww.link.com">
                Get Acrobat Reader for free from Adobe
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  isLoggedIn: state.user.login.currentlyLoggedIn,
});

export default connect(mapStateToProps)(App);
