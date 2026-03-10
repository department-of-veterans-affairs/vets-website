import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  getTooltipByName,
  createNewTooltip,
  setTooltip,
  incrementTooltip,
  updateTooltipVisibility,
} from '../../actions/tooltip';

const DismissibleAlert = ({
  tooltipName,
  status,
  headline,
  children,
  className,
}) => {
  const dispatch = useDispatch();
  const tooltipVisible = useSelector(
    state => state.sm?.tooltip?.tooltipVisible,
  );
  const tooltipId = useSelector(state => state.sm?.tooltip?.tooltipId);

  useEffect(
    () => {
      const fetchOrCreateTooltip = async () => {
        const existing = await dispatch(getTooltipByName(tooltipName));

        if (existing?.id) {
          dispatch(setTooltip(existing.id, !existing.hidden));
          if (!existing.hidden) {
            dispatch(incrementTooltip(existing.id));
          }
        } else if (!existing) {
          const created = await dispatch(createNewTooltip(tooltipName));
          if (created?.id) {
            dispatch(setTooltip(created.id, !created.hidden));
          }
        }
      };

      fetchOrCreateTooltip();
    },
    [dispatch, tooltipName],
  );

  const handleClose = useCallback(
    () => {
      if (tooltipId) {
        dispatch(updateTooltipVisibility(tooltipId));
      }
    },
    [dispatch, tooltipId],
  );

  if (!tooltipVisible) return null;

  return (
    <VaAlert
      status={status}
      closeable
      closeBtnAriaLabel="Close notification"
      onCloseEvent={handleClose}
      className={className}
      data-testid="dismissible-tooltip-alert"
      data-dd-privacy="mask"
      data-dd-action-name={`Dismissible tooltip alert - ${tooltipId}`}
    >
      {headline && <h2 slot="headline">{headline}</h2>}
      {children}
    </VaAlert>
  );
};

DismissibleAlert.propTypes = {
  children: PropTypes.node.isRequired,
  tooltipName: PropTypes.string.isRequired,
  className: PropTypes.string,
  headline: PropTypes.string,
  status: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
};

DismissibleAlert.defaultProps = {
  status: 'info',
  headline: null,
  className: '',
};

export default DismissibleAlert;
