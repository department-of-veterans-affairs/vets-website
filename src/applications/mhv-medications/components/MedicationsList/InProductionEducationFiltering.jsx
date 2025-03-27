import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { datadogRum } from '@datadog/browser-rum';
import {
  VaButton,
  VaIcon,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { dataDogActionNames } from '../../util/dataDogConstants';
import { tooltipNames } from '../../util/constants';
import { Actions } from '../../util/actionTypes';
import {
  getTooltips,
  createNewTooltip,
  incrementTooltip,
  setTooltip,
  updateTooltipVisibility,
} from '../../actions/tooltip'; // Adjust the import path according to your project structure

export const RX_IPE_FILTERING_DESCRIPTION_ID = 'rx-ipe-filtering-description';

const InProductionEducationFiltering = () => {
  const dispatch = useDispatch();

  const tooltipVisible = useSelector(
    state => state?.rx?.inProductEducation?.tooltipVisible,
  );
  const tooltipId = useSelector(
    state => state?.rx?.inProductEducation?.tooltipId,
  );

  useEffect(
    () => {
      const fetchTooltips = async () => {
        try {
          const tooltips = await dispatch(getTooltips());
          const filterTooltip = tooltips?.find(
            tooltip =>
              tooltip.tooltipName ===
              tooltipNames.mhvMedicationsTooltipFilterAccordion,
          );

          if (filterTooltip) {
            dispatch(setTooltip(filterTooltip.id, !filterTooltip.hidden));

            if (!filterTooltip.hidden) {
              dispatch(incrementTooltip(filterTooltip.id));
            }
          } else {
            const newTooltipResponse = await dispatch(createNewTooltip());

            if (newTooltipResponse) {
              dispatch(
                setTooltip(newTooltipResponse.id, !newTooltipResponse.hidden),
              );
            }
          }
        } catch (error) {
          dispatch({
            type: Actions.Tooltip.GET_TOOLTIPS_ERROR,
            error,
          });
        }
      };

      fetchTooltips();
    },
    [dispatch],
  );

  const handleStopShowing = async () => {
    datadogRum.addAction(
      dataDogActionNames.medicationsListPage.STOP_SHOWING_IPE_FILTERING_HINT,
    );
    await dispatch(updateTooltipVisibility(tooltipId, false));
    const filterAccordionElement = document.getElementById('filter');
    focusElement(filterAccordionElement);
  };

  return (
    <>
      {tooltipVisible && (
        <div
          id="rx-ipe-filtering-container"
          data-testid="rx-ipe-filtering-container"
          className="vads-u-margin-top--3 vads-u-padding--2p5"
        >
          <p
            className="vads-u-margin--0 vads-u-padding-right--5"
            id={RX_IPE_FILTERING_DESCRIPTION_ID}
          >
            Filter the medications list to easily find what you are looking for.
          </p>
          <button
            aria-label="Dismiss filtering hint"
            id="rx-ipe-filtering-close"
            data-testid="rx-ipe-filtering-close"
            onClick={handleStopShowing}
          >
            <VaIcon
              size={3}
              icon="cancel"
              aria-label="dismiss icon"
              alt="dismiss icon"
              onClick={handleStopShowing}
              role="img"
            />
          </button>
          <VaButton
            className="vads-u-margin-top--3"
            secondary
            text="Stop showing this hint"
            data-testid="rx-ipe-filtering-stop-showing-this-hint"
            onClick={handleStopShowing}
            aria-describedby="rx-ipe-filtering-stop-showing-this-hint-info"
          />
          <span
            id="rx-ipe-filtering-stop-showing-this-hint-info"
            className="sr-only"
          >
            This hint for filtering will not appear anymore
          </span>
        </div>
      )}
    </>
  );
};

export default InProductionEducationFiltering;
