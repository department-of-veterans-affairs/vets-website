import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

export default function CancelButton(props) {
  const { jumpToPage, backPage } = props;
  const onClick = useCallback(
    () => {
      jumpToPage(backPage);
    },
    [backPage, jumpToPage],
  );
  return (
    <button
      onClick={onClick}
      className="usa-button-secondary usa-button-big"
      data-testid="cancel-button"
      type="button"
    >
      Cancel
    </button>
  );
}

CancelButton.propTypes = {
  backPage: PropTypes.string,
  jumpToPage: PropTypes.func,
};
