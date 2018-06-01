import React from 'react';
import { connect } from 'react-redux';
import appendQuery from 'append-query';
import URLSearchParams from 'url-search-params';

import recordEvent from '../../../monitoring/record-event';

import SignInModal from '../../../user/authentication/components/SignInModal';
import {
  isLoggedIn,
  isProfileLoading,
  isLOA3
} from '../../../user/selectors';
import { getProfile } from '../../../user/profile/actions';
import { updateLoggedInStatus } from '../../../user/authentication/actions';

import {
  toggleLoginModal,
  toggleSearchHelpUserMenu
} from '../../../site-wide/user-nav/actions';

import SearchHelpSignIn from '../components/SearchHelpSignIn';
import { selectUserGreeting } from '../selectors';

// const SESSION_REFRESH_INTERVAL_MINUTES = 45;

export class Main extends React.Component {
  componentDidMount() {
    window.addEventListener('message', this.setToken);
    this.bindNavbarLinks();

    // In some cases this component is mounted on a url that is part of the login process and doesn't need to make another
    // request, because that data will be passed to the parent window and done there instead.
    if (!window.location.pathname.includes('auth/login/callback')) {
      window.addEventListener('load', this.checkTokenStatus);
    }
  }

  componentDidUpdate() {
    const { currentlyLoggedIn, showLoginModal } = this.props;
    const nextParam = this.getRedirectUrl();

    const shouldRedirect =
      currentlyLoggedIn && nextParam && !window.location.pathname.includes('verify');

    if (shouldRedirect) {
      const redirectPath = nextParam.startsWith('/') ? nextParam : `/${nextParam}`;
      window.location.replace(redirectPath);
    }

    const shouldCloseLoginModal = currentlyLoggedIn && showLoginModal;

    if (shouldCloseLoginModal) { this.props.toggleLoginModal(false); }
  }

  componentWillUnmount() {
    this.unbindNavbarLinks();
  }

  setToken = (event) => {
    if (event.data === sessionStorage.userToken) { this.props.getProfile(); }
  }

  getRedirectUrl = () => (new URLSearchParams(window.location.search)).get('next');

  bindNavbarLinks = () => {
    [...document.querySelectorAll('.login-required')].forEach(el => {
      el.addEventListener('click', e => {
        if (!this.props.login.currentlyLoggedIn) {
          e.preventDefault();
          const nextQuery = { next: el.getAttribute('href') };
          const nextPath = appendQuery('/', nextQuery);
          history.pushState({}, el.textContent, nextPath);
          this.props.toggleLoginModal(true);
        }
      });
    });
  }

  unbindNavbarLinks = () => {
    [...document.querySelectorAll('.login-required')].forEach(el => {
      el.removeEventListener('click');
    });
  }

  checkTokenStatus = () => {
    if (sessionStorage.userToken) {
      // @todo once we have time to replace the confirm dialog with an actual modal we should uncomment this code.
      // if (moment() > moment(sessionStorage.entryTime).add(SESSION_REFRESH_INTERVAL_MINUTES, 'm')) {
      //   if (confirm('For security, you’ll be automatically signed out in 2 minutes. To stay signed in, click OK.')) {
      //     login();
      //   } else {
      //     logout();
      //   }
      // } else {
      //   if (this.props.getProfile()) {
      //     this.props.updateLoggedInStatus(true);
      //   }
      // }

      // @todo after doing the above, remove this code.
      if (this.props.getProfile()) {
        recordEvent({ event: 'login-user-logged-in' });
        this.props.updateLoggedInStatus(true);
      }
    } else {
      this.props.updateLoggedInStatus(false);
      if (this.getRedirectUrl()) { this.props.toggleLoginModal(true); }
    }
  }

  handleCloseModal = () => {
    this.props.toggleLoginModal(false);
    recordEvent({ event: 'login-modal-closed' });
  }

  render() {
    return (
      <div className="row va-flex">
        <nav id="vetnav" role="navigation" hidden>
          <ul id="vetnav-menu" role="menubar">
            <li><a href="/" className="vetnav-level1" role="menuitem">Home</a></li>

            <li>
              <button
                aria-controls="vetnav-explore"
                role="button"
                aria-haspopup="true"
                className="vetnav-level1"
                onClick="recordEvent({ event: 'nav-header-top-level' });">Explore and Apply for Benefits</button>
              <div id="vetnav-explore" className="vetnav-panel" role="none" hidden>
                <ul role="menu" aria-label="Explore benefits">
                  <li>
                    <button
                      className="vetnav-level2"
                      role="button"
                      aria-haspopup="true"
                      aria-controls="vetnav-disability"
                      onClick="recordEvent({ event: 'nav-header-second-level' });">Disability</button>
                    <ul
                      className="vetnav-panel vetnav-panel--submenu"
                      id="vetnav-disability"
                      role="menu"
                      aria-label="Disability"
                      hidden>
                      <li>
                        <button
                          className="back-button"
                          aria-controls="vetnav-disability">Back to Menu</button>
                        <div className="vetnav-level2-heading">Disability</div>
                      </li>
                      <li><a href="/disability-benefits/" onClick="reportHeaderNav('Explore Benefits->Disabilty');">Disability Benefits Overview</a></li>
                      <li><a href="/disability-benefits/eligibility/" onClick="reportHeaderNav('Explore Benefits->Disabilty');">Eligibility</a></li>
                      <li><a href="/disability-benefits/apply/" onClick="reportHeaderNav('Explore Benefits->Disabilty');">Application Process</a></li>
                      <li><a href="/disability-benefits/conditions/" onClick="reportHeaderNav('Explore Benefits->Disabilty');">Conditions</a></li>
                      <li><a className="login-required" href="/track-claims/" onClick="reportHeaderNav('Explore Benefits->Disabilty');">Track Your Claims and Appeals</a></li>
                      <li><a href="/disability-benefits/claims-appeal/" onClick="reportHeaderNav('Explore Benefits->Disabilty');">Appeals Process</a></li>
                      <li><a className="usa-button va-button-primary va-external--light" href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=disability-compensation"></a></li>
                    </ul>
                  </li>

                  <li>
                    <button
                      className="vetnav-level2"
                      role="button"
                      aria-haspopup="true"
                      aria-controls="vetnav-healthcare"
                      onClick="recordEvent({ event: 'nav-header-second-level' });">Health Care</button>
                    <ul
                      className="vetnav-panel vetnav-panel--submenu"
                      id="vetnav-healthcare"
                      role="menu"
                      aria-label="Health care"
                      hidden>
                      <li>
                        <button
                          className="back-button"
                          aria-controls="vetnav-healthcare">Back to Menu</button>
                        <div className="vetnav-level2-heading">Health Care</div>
                      </li>
                      <li><a href="/health-care/" onClick="reportHeaderNav('Explore Benefits->Health Care');">Health Care Benefits Overview</a></li>
                      <li><a href="/health-care/eligibility/" onClick="reportHeaderNav('Explore Benefits->Health Care');">Eligibility</a></li>
                      <li><a href="/health-care/apply/" onClick="reportHeaderNav('Explore Benefits->Health Care');">Application Process</a></li>
                      <li><a href="/health-care/health-conditions/" onClick="reportHeaderNav('Explore Benefits->Health Care');">Health Needs and Conditions</a></li>
                      <li><a className="login-required" href="/health-care/prescriptions/" onClick="reportHeaderNav('Explore Benefits->Health Care');">Refill Prescriptions</a></li>
                      <li><a className="login-required" href="/health-care/messaging/" onClick="reportHeaderNav('Explore Benefits->Health Care');">Message Your Health Care Team</a></li>
                      <li><a href="/health-care/health-records/" onClick="reportHeaderNav('Explore Benefits->Health Care');">Get Your VA Health Records</a></li>
                      <li><a href="/health-care/apply/application/" className="usa-button va-button-primary" onClick="reportHeaderNav('Explore Benefits->Health Care');">Apply Now</a></li>
                    </ul>
                  </li>

                  <li>
                    <button
                      className="vetnav-level2"
                      role="button"
                      aria-haspopup="true"
                      aria-controls="vetnav-edu"
                      onClick="recordEvent({ event: 'nav-header-second-level' });">Education and Training</button>
                    <ul
                      className="vetnav-panel vetnav-panel--submenu"
                      id="vetnav-edu"
                      role="menu"
                      aria-label="Education and training"
                      hidden>
                      <li>
                        <button
                          className="back-button"
                          aria-controls="vetnav-edu">Back to Menu</button>
                        <div className="vetnav-level2-heading">Education and Training</div>
                      </li>
                      <li><a href="/education/" onClick="reportHeaderNav('Explore Benefits->Education Training');">Education and Training Benefits Overview</a></li>
                      <li><a href="/education/eligibility/" onClick="reportHeaderNav('Explore Benefits->Education Training');">Eligibility</a></li>
                      <li><a href="/education/apply/" onClick="reportHeaderNav('Explore Benefits->Education Training');">Application Process</a></li>
                      <li><a href="/education/gi-bill/" onClick="reportHeaderNav('Explore Benefits->Education Training');">GI Bill Programs</a></li>
                      <li><a href="/employment/vocational-rehab-and-employment" onClick="reportHeaderNav('Explore Benefits->Vocational Rehab and Employment');">Vocational Rehabilitation &amp; Employment (VR&amp;E)</a></li>
                      <li><a href="/gi-bill-comparison-tool/" onClick="reportHeaderNav('Explore Benefits->Education Training');">Compare GI Bill Benefits</a></li>
                      <li><a href="/education/apply/" className="usa-button va-button-primary" onClick="reportHeaderNav('Explore Benefits->Education Training');">Apply Now</a></li>
                    </ul>
                  </li>

                  <li>
                    <button
                      className="vetnav-level2"
                      role="button"
                      aria-haspopup="true"
                      aria-controls="vetnav-housing"
                      onClick="recordEvent({ event: 'nav-header-second-level' });">Housing Assistance</button>
                    <ul
                      className="vetnav-panel vetnav-panel--submenu"
                      id="vetnav-housing"
                      role="menu"
                      aria-label="Housing assistance"
                      hidden>
                    <li>
                      <button
                      className="vetnav-level2 back-button"
                      aria-controls="vetnav-housing">Back to Menu</button>
                    </li>
                      <div className="vetnav-level2-heading">Housing Assistance</div>
                      <li><a href="/housing-assistance/" onClick="reportHeaderNav('Explore Benefits->Housing Assistance');">Housing Assistance Overview</a></li>
                      <li><a href="/housing-assistance/home-loans/" onClick="reportHeaderNav('Explore Benefits->Housing Assistance');">Home Loans</a></li>
                      <li><a href="/housing-assistance/adaptive-housing-grants/" onClick="reportHeaderNav('Explore Benefits->Housing Assistance');">Adaptive Housing Grants</a></li>
                    </ul>
                  </li>

                  <li>
                    <button
                      className="vetnav-level2"
                      role="button"
                      aria-haspopup="true"
                      aria-controls="vetnav-careers"
                      onClick="recordEvent({ event: 'nav-header-second-level' });">Careers and Employment</button>
                    <ul
                      className="vetnav-panel vetnav-panel--submenu"
                      id="vetnav-careers"
                      role="menu"
                      aria-label="Careers and employment"
                      hidden>
                      <li>
                        <button
                        className="vetnav-level2 back-button"
                        aria-controls="vetnav-careers">Back to Menu</button>
                        <div className="vetnav-level2-heading">Careers and Employment</div>
                      </li>
                      <li><a href="/employment/" onClick="reportHeaderNav('Explore Benefits->Careers Employment');">Careers and Employment Overview</a></li>
                      <li><a href="/employment/vocational-rehab-and-employment/" onClick="reportHeaderNav('Explore Benefits->Careers Employment');">Vocational Rehabilitation &amp; Employment (VR&amp;E)</a></li>
                      <li><a href="/employment/job-seekers/register-your-business/" onClick="reportHeaderNav('Explore Benefits->Careers Employment');">Small Business Support</a></li>
                      <li><a href="/employment/job-seekers/family-members/" onClick="reportHeaderNav('Explore Benefits->Careers Employment');">Resources for Military and Veteran Family Members</a></li>
                    </ul>
                  </li>

                  <li>
                    <button
                      className="vetnav-level2"
                      role="button"
                      aria-haspopup="true"
                      aria-controls="vetnav-lifeinsurance"
                      onClick="recordEvent({ event: 'nav-header-second-level' });">Life Insurance</button>
                    <ul
                      className="vetnav-panel vetnav-panel--submenu"
                      id="vetnav-lifeinsurance"
                      role="menu"
                      aria-label="Life insurance"
                      hidden>
                      <li>
                        <button
                          className="back-button"
                          aria-controls="vetnav-lifeinsurance">Back to Menu</button>
                        <div className="vetnav-level2-heading">Life Insurance</div>
                      </li>
                      <li><a href="/life-insurance/" onClick="reportHeaderNav('Explore Benefits->Life Insurance');">Life Insurance Overview</a></li>
                      <li><a href="/life-insurance/options-and-eligibility/" onClick="reportHeaderNav('Explore Benefits->Life Insurance');">Options and Eligibility</a></li>
                      <li><a href="/life-insurance/disabled-and-terminally-ill/" onClick="reportHeaderNav('Explore Benefits->Life Insurance');">Totally Disabled or Terminally Ill</a></li>
                      <li><a href="/life-insurance/manage-your-policy/" onClick="reportHeaderNav('Explore Benefits->Life Insurance');">Managing Your Policy</a></li>
                    </ul>
                  </li>

                  <li>
                    <button
                      className="vetnav-level2"
                      role="button"
                      aria-haspopup="true"
                      aria-controls="vetnav-pension"
                      onClick="recordEvent({ event: 'nav-header-second-level' });">Pension</button>
                    <ul
                      className="vetnav-panel vetnav-panel--submenu"
                      id="vetnav-pension"
                      role="menu"
                      aria-label="Pension"
                      hidden>
                      <li>
                        <button
                        className="vetnav-level2 back-button"
                        aria-controls="vetnav-pension">Back to Menu</button>
                        <div className="vetnav-level2-heading">Pension</div>
                      </li>
                      <li><a href="/pension/" onClick="reportHeaderNav('Explore Benefits->Pension');">Pension Benefits Overview</a></li>
                      <li><a href="/pension/eligibility/" onClick="reportHeaderNav('Explore Benefits->Pension');">Eligibility</a></li>
                      <li><a href="/pension/apply/" onClick="reportHeaderNav('Explore Benefits->Pension');">Application Process</a></li>
                      <li><a href="/pension/survivors-pension/" onClick="reportHeaderNav('Explore Benefits->Pension');">Survivors Pension</a></li>
                    </ul>
                  </li>

                  <li>
                    <button
                      className="vetnav-level2"
                      role="button"
                      aria-haspopup="true"
                      aria-controls="vetnav-burials"
                      onClick="recordEvent({ event: 'nav-header-second-level' });">Burials and Memorials</button>
                    <ul
                      className="vetnav-panel vetnav-panel--submenu"
                      id="vetnav-burials"
                      role="menu"
                      aria-label="Burials and memorials"
                      hidden>
                      <li>
                        <button
                          className="back-button"
                          aria-controls="vetnav-burials">Back to Menu</button>
                        <div className="vetnav-level2-heading">Burials and Memorials</div>
                      </li>
                      <li><a href="/burials-and-memorials/" onClick="reportHeaderNav('Explore Benefits->Burials Memorials');">Burials and Memorials Overview</a></li>
                      <li><a href="/burials-and-memorials/eligibility/" onClick="reportHeaderNav('Explore Benefits->Burials Memorials');">Eligibility</a></li>
                      <li><a href="/burials-and-memorials/burial-planning/" onClick="reportHeaderNav('Explore Benefits->Burials Memorials');">Plan a Burial</a></li>
                      <li><a href="/burials-and-memorials/survivor-and-dependent-benefits/" onClick="reportHeaderNav('Explore Benefits->Burials Memorials');">Allowances and Survivor Compensation</a></li>
                      <li><a href="/burials-and-memorials/find-a-cemetery/" onClick="reportHeaderNav('Explore Benefits->Burials Memorials');">Find a Cemetery</a></li>
                    </ul>
                  </li>
                  <li><a href="/families-caregivers/" className="vetnav-level2 vetnav-level2-link vetnav-trigger">Family and Caregiver Benefits</a></li>
                </ul>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentlyLoggedIn: isLoggedIn(state),
    isProfileLoading: isProfileLoading(state),
    isLOA3: isLOA3(state),
    userGreeting: selectUserGreeting(state),
    ...state.navigation
  };
};

const mapDispatchToProps = {
  toggleLoginModal,
  toggleSearchHelpUserMenu,
  updateLoggedInStatus,
  getProfile
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
