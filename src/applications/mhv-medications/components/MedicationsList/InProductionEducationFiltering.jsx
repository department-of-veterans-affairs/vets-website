import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { datadogRum } from '@datadog/browser-rum';
import {
  VaButton,
  VaIcon,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { dataDogActionNames } from '../../util/dataDogConstants';
import {
  getTooltips,
  createNewTooltip,
  updateTooltipVisibility,
  hideTooltip,
  incrementTooltip,
} from '../../actions/prescriptions';
import { Actions } from '../../util/actionTypes';

const InProductionEducationFiltering = () => {
  const dispatch = useDispatch();
  const tooltipVisible = useSelector(
    state => state.rx.inProductEducation?.tooltipVisible,
  );
  const tooltipId = useSelector(
    state => state.rx.inProductEducation?.tooltipId,
  );

  useEffect(
    () => {
      const fetchTooltipData = async () => {
        const response = await dispatch(getTooltips());
        const filterTooltip = response.data?.find(
          tip => tip.tooltip_name === 'mhv_medications_tooltip',
        );
        let newTooltipResponse;

        if (filterTooltip) {
          if (filterTooltip.hidden) {
            dispatch(hideTooltip());
          } else {
            dispatch({
              type: Actions.Tooltip.SHOW_TOOLTIP,
              tooltipId: filterTooltip.id,
            });
          }
        } else {
          newTooltipResponse = await dispatch(createNewTooltip());
          dispatch({
            type: Actions.Tooltip.SHOW_TOOLTIP,
            tooltipId: newTooltipResponse.id,
          });
        }

        await dispatch(
          incrementTooltip(
            filterTooltip?.id || (newTooltipResponse && newTooltipResponse.id),
          ),
        );
      };

      fetchTooltipData();
    },
    [dispatch],
  );

  const handleStopShowing = async () => {
    datadogRum.addAction(
      dataDogActionNames.medicationsListPage.STOP_SHOWING_IPE_FILTERING_HINT,
    );
    await updateTooltipVisibility(tooltipId, true);
    dispatch(hideTooltip());
  };

  return (
    <>
      {tooltipVisible && (
        <div
          id="rx-ipe-filtering-container"
          data-testid="rx-ipe-filtering-container"
          className="vads-u-margin-top--3 vads-u-padding--2p5"
        >
          <p className="vads-u-margin--0">
            Filter the medications list to easily find what you are looking for.
          </p>
          <VaButton
            className="vads-u-width--full tablet:vads-u-width--auto vads-u-margin-top--3"
            secondary
            text="Stop showing this hint"
            data-testid="rx-ipe-filtering-stop-showing-this-hint"
            onClick={handleStopShowing}
          />
          <VaIcon
            size={3}
            icon="cancel"
            id="rx-ipe-filtering-close"
            data-testid="rx-ipe-filtering-close"
            onClick={handleStopShowing}
            aria-label="Close button - Stop showing this hint"
          />
        </div>
      )}
    </>
  );
};

export default InProductionEducationFiltering;
