import React from 'react';
import { connect } from 'react-redux';
import { environment } from '@department-of-veterans-affairs/platform-utilities/exports';
import PropTypes from 'prop-types';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { isLoggedIn } from 'platform/user/selectors';

function ProfileNotUpdatedNote(props) {
  const { loggedIn, includePrefix, includeLink, includePhone } = props;

  return (
    <>
      {loggedIn && (
        <>
          <p>
            {includePrefix && <strong>Note: </strong>}
            This is the information we have in your VA.gov profile. Any changes
            you make on this screen will only affect this application.
          </p>
          {includePhone && (
            <>
              <p>
                If you need to change this information in your VA.gov profile,
                you can call us at{' '}
                <va-telephone contact={CONTACTS.VA_BENEFITS} extension={0} /> (
                <va-telephone contact={CONTACTS['711']} tty />
                ). We’re here 24/7.
              </p>
            </>
          )}
          {includeLink && (
            <>
              <va-link
                href={`${environment.BASE_URL}/change-address`}
                text="Find out how to change your address in your VA.gov profile"
                external
              />
            </>
          )}
        </>
      )}
    </>
  );
}

ProfileNotUpdatedNote.propTypes = {
  formData: PropTypes.object,
  includeLink: PropTypes.bool,
  includePhone: PropTypes.bool,
  includePrefix: PropTypes.bool,
  loggedIn: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    loggedIn: isLoggedIn(state),
  };
}

export default connect(mapStateToProps)(ProfileNotUpdatedNote);
