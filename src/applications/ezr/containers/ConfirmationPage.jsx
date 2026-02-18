import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ConfirmationScreenView from '../components/ConfirmationPage/ConfirmationScreenView';
import ConfirmationPrintView from '../components/ConfirmationPage/ConfirmationPrintView';
import { normalizeFullName } from '../utils/helpers/general';
import { CONTACTS } from '../utils/imports';

const ConfirmationPage = ({ form, profile }) => {
  const {
    submission: { response },
  } = form;
  const { userFullName } = profile;
  const veteranName = normalizeFullName(userFullName, true);

  return (
    <div className="ezr-confirmation-page vads-u-margin-bottom--2p5">
      <section className="ezr-confirmation--screen no-print">
        <ConfirmationScreenView
          name={veteranName}
          timestamp={response ? response.timestamp : null}
        />
      </section>

      <section className="ezr-confirmation--print">
        <ConfirmationPrintView
          name={veteranName}
          timestamp={response ? response.timestamp : null}
        />
      </section>

      <section>
        <h2>What are my next steps?</h2>
        <p>
          Once you submit your form, it may take up to 5 days for us to review
          and update your information.
        </p>
        <p>
          If your updated information changes your VA health care benefits,
          we’ll send you a letter in the mail.
        </p>
      </section>

      <section>
        <h2>
          Can I submit other supporting documents if I answered questions about
          my military service history?
        </h2>
        <p>
          Yes. If you answered questions about your military service history and
          may have had exposure to any toxins or other hazards while you were
          deployed or during active duty training or service, you can also send
          us a written statement with more information by mail.
        </p>
        <p>
          It’s your choice whether you want to submit a written statement. We’ll
          use the information to confirm your military service history.
        </p>
        <p>Here’s what you can include in your written statement:</p>
        <ul>
          <li>Any toxins or hazards you were exposed to</li>
          <li>Month and year when you were exposed</li>
          <li>
            Type of activity or work you were doing when you were exposed (like
            basic training)
          </li>
          <li>
            And you’ll need to write your name and Social Security number on
            your statement.
          </li>
        </ul>
        <p>Mail your documents here:</p>
        <p className="va-address-block">
          Health Eligibility Center
          <br role="presentation" />
          PO Box 5207
          <br role="presentation" />
          Janesville, WI 53547-5207
        </p>
      </section>

      <section>
        <h2>What if I have more questions?</h2>
        <p>
          Call our Health Eligibility Center at{' '}
          <va-telephone contact={CONTACTS['222_VETS']} /> (
          <va-telephone contact={CONTACTS['711']} tty />) and select 2. We’re
          here Monday through Friday, 8:00 a.m. until 8:00 p.m. ET.
        </p>
      </section>

      <a className="vads-c-action-link--green" href="https://www.va.gov/">
        Go back to VA.gov
      </a>
    </div>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.object,
  profile: PropTypes.object,
};

const mapStateToProps = state => ({
  form: state.form,
  profile: state.user.profile,
});

export default connect(mapStateToProps)(ConfirmationPage);
