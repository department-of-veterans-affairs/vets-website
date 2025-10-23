import React from 'react';
import PropTypes from 'prop-types';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const NeedHelp = ({ noWrapper = true }) => {
  const Wrap = noWrapper ? React.Fragment : 'va-need-help';
  return (
    <Wrap>
      <p className="help-talk">
        For help filling out this form, or if the form isn’t working right,
        please call VA Benefits and Services at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} />. We’re here Monday
        through Friday, 8:00 a.m. to 9:00 p.m. ET. If you have hearing loss,
        call <va-telephone tty contact="711" />
      </p>
    </Wrap>
  );
};

export default NeedHelp;

NeedHelp.propTypes = {
  noWrapper: PropTypes.bool,
};
