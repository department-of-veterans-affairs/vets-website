import React from 'react';
import { useSelector } from 'react-redux';

import { isLoggedIn, selectProfile } from 'platform/user/selectors';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import ConfirmationScreenView from '../components/ConfirmationPage/ConfirmationScreenView';
import ConfirmationPrintView from '../components/ConfirmationPage/ConfirmationPrintView';
import { normalizeFullName } from '../utils/helpers';

const ConfirmationPage = () => {
  const { submission, data } = useSelector(state => state.form);
  const { userFullName } = useSelector(selectProfile);
  const loggedIn = useSelector(isLoggedIn);
  const { response } = submission;

  // if authenticated, get veteran's name from profile, else, from form data
  const nameToDisplay = loggedIn
    ? userFullName
    : data['view:veteranInformation'].veteranFullName;
  const veteranName = normalizeFullName(nameToDisplay, true);

  return (
    <div className="hca-confirmation-page vads-u-margin-bottom--2p5">
      <section className="hca-confirmation--screen no-print">
        <ConfirmationScreenView
          name={veteranName}
          timestamp={response ? response.timestamp : null}
        />
      </section>

      <section className="hca-confirmation--print">
        <ConfirmationPrintView
          name={veteranName}
          timestamp={response ? response.timestamp : null}
        />
      </section>

      <section>
        <h2>What to do if you have questions now</h2>
        <p>
          If we haven’t contacted you within a week after you submitted your
          application, please don’t apply again:
        </p>
        <ul>
          <li>
            Please call our toll-free hotline at{' '}
            <va-telephone contact={CONTACTS['222_VETS']} />. We’re here Monday
            through Friday, 8:00 a.m. to 8:00 p.m.{' '}
            <abbr title="Eastern Time">ET</abbr>.
          </li>
        </ul>
        <p className="confirmation-guidance-message no-print">
          <va-link
            href="/health-care/after-you-apply/"
            text="Learn more about what happens after you apply"
          />
        </p>
      </section>

      <section>
        <h2>How can I check the status of my application?</h2>
        <p>Sign in with one of these verified accounts:</p>
        <ul>
          <li>Login.gov</li>
          <li>ID.me</li>
          <li>Premium My HealtheVet</li>
          <li>Premium DS Logon</li>
        </ul>
        <p>
          Then go back to the health care application introduction page. You’ll
          find your application status at the top of the page.
        </p>
        <p className="confirmation-guidance-message no-print">
          <a
            href="/health-care/apply/application"
            className="vads-c-action-link--green"
          >
            Go to health care application page
          </a>
        </p>
      </section>

      <section>
        <h2>How will I know if I’m enrolled in VA health care?</h2>
        <p>
          If enrolled, you’ll receive a Veterans Health Benefits Handbook in the
          mail within about 10 days.
        </p>
        <p>
          We’ll also call to welcome you to the VA health care program, help you
          with scheduling your first appointment, and answer any questions you
          may have about your health care benefits.
        </p>
        <p className="confirmation-guidance-message no-print">
          <va-link
            href="/health-care/after-you-apply/"
            text="Learn more about what happens after you apply"
          />
        </p>
      </section>
    </div>
  );
};

export default ConfirmationPage;
