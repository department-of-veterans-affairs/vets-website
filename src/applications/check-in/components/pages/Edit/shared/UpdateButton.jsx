import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

export default function UpdateButton(props) {
  const { jumpToPage, backPage, clearData } = props;
  const onClick = useCallback(
    () => {
      clearData();
      jumpToPage(backPage);
    },
    [backPage, jumpToPage, clearData],
  );
  return (
    <button
      onClick={onClick}
      className="usa-button usa-button-big"
      data-testid="update-button"
      type="button"
    >
      Update
    </button>
  );
}

UpdateButton.propTypes = {
  backPage: PropTypes.string,
  clearData: PropTypes.func,
  jumpToPage: PropTypes.func,
};
