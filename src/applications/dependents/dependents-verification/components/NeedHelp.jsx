import React from 'react';
import PropTypes from 'prop-types';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const NeedHelp = ({ noWrapper = true }) => {
  const Wrap = noWrapper ? React.Fragment : 'va-need-help';
  return (
    <Wrap>
      <p className="help-talk">
        <strong>If you have trouble using this online form</strong>, call VA
        Benefits and Services at <va-telephone contact={CONTACTS.VA_BENEFITS} />{' '}
        (<va-telephone tty contact="711" />
        ). We’re here 24/7.
      </p>
    </Wrap>
  );
};

export default NeedHelp;

NeedHelp.propTypes = {
  noWrapper: PropTypes.bool,
};
