import React from 'react';
import PropTypes from 'prop-types';

import { EDITING_PAGE_NAMES } from '../../../../utils/appConstants';

export default function Header(props) {
  const { what, editingPage, value } = props;
  const addOrEdit = value ? 'Edit' : 'Add';
  const getWhoseFromPage = () => {
    if (editingPage === EDITING_PAGE_NAMES.DEMOGRAPHICS) {
      return 'your';
    }
    if (editingPage === EDITING_PAGE_NAMES.EMERGENCY_CONTACT) {
      return "emergency contact's";
    }
    if (editingPage === EDITING_PAGE_NAMES.NEXT_OF_KIN) {
      return "next of kin's";
    }
    return '';
  };
  const whose = getWhoseFromPage();

  return (
    <h1 data-testid="edit-header">
      {addOrEdit} {whose} {what}
    </h1>
  );
}

Header.propTypes = {
  editingPage: PropTypes.string.isRequired,
  what: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};
