import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { datadogRum } from '@datadog/browser-rum';
import {
  VaButton,
  VaIcon,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { dataDogActionNames } from '../../util/dataDogConstants';
import { tooltipHintContent } from '../../util/constants';
import {
  createNewTooltip,
  incrementTooltip,
  setTooltip,
  updateTooltipVisibility,
  getTooltip,
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
        const filterTooltip = await dispatch(getTooltip());

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
            {tooltipHintContent.filterAccordion.HINT}
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
