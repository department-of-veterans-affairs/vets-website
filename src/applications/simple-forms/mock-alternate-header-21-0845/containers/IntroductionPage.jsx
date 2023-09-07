import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import recordEvent from 'platform/monitoring/record-event';
import { getNextPagePath } from 'platform/forms-system/src/js/routing';
import { Link } from 'react-router';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  getStartPage = () => {
    const { pageList, pathname, formData } = this.props?.route;
    const data = formData || {};
    if (pathname) return getNextPagePath(pageList, data, pathname);
    return pageList[1].path;
  };

  handleClick = () => {
    recordEvent({ event: 'no-login-start-form' });
  };

  render() {
    return (
      <article className="schemaform-intro">
        <FormTitle
          title="Authorize VA to release your information to a third-party source"
          subtitle="Authorization To Disclose Personal Information To a Third Party (VA Form 21-0845)"
        />
        <h2>Here’s how to apply online</h2>
        <p>
          Complete this form. After you submit the form, you’ll get a
          confirmation message. You can print this page for your records.
        </p>
        <p>
          A Veteran may submit an Authorization to Disclose Personal Information
          to a third party on their own. Alternatively, a claimant or witness
          may submit on behalf of a Veteran.
        </p>
        <h2>Who is eligible to use this form?</h2>
        <ul>
          <li>A Veteran or claimant submitting on their own behalf</li>
          <li>
            A non-Veteran beneficiary or claimant submitting on behalf of a
            Veteran
          </li>
        </ul>
        <h2>How do I prepare before starting this form?</h2>
        <p>
          Gather the required information listed below that you’ll need to
          submit this form:
        </p>
        <ul>
          <li>Veteran’s Full Name</li>
          <li>Veteran’s Social Security number</li>
          <li>Veteran's Date of Birth</li>
        </ul>
        <h2>What if I change my mind?</h2>
        <p>
          If you change your mind and do not want VA to give out your personal
          benefit or claim information, you may notify us in writing, or by
          telephone at <va-telephone contact="8008271000" /> or online through{' '}
          <a href="https://ask.va.gov/">Ask VA</a>. Upon notification from you
          VA will no longer give out benefit or claim information (except for
          the information VA has already given out based on your permission).
        </p>
        <p>
          {/* Sign in removed because we are only testing unauthenticated experience.
              Do not use this code. See the actual form 0845 instead. */}
          <Link
            onClick={this.handleClick}
            to={this.getStartPage}
            className="vads-c-action-link--green schemaform-start-button"
          >
            Start your application without signing in
          </Link>
        </p>
        <va-omb-info
          res-burden={5}
          omb-number="2900-0736"
          exp-date="02/28/2026"
        />
      </article>
    );
  }
}

export default IntroductionPage;
