import React, { useEffect, useState } from 'react';
import { datadogRum } from '@datadog/browser-rum';
import {
  VaButton,
  VaIcon,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { dataDogActionNames } from '../../util/dataDogConstants';
import {
  apiHideTooltip,
  createTooltip,
  getTooltipsList,
  incrementTooltipCounter,
} from '../../api/rxApi';

export const RX_IPE_FILTERING_DESCRIPTION_ID = 'rx-ipe-filtering-description';

const InProductionEducationFiltering = () => {
  const [tooltipVisible, setTooltipVisible] = useState(null);
  const [tooltipId, setTooltipId] = useState(null);

  // TODO: consider a different approach for error handling.
  useEffect(
    () => {
      getTooltipsList()
        .then(response => {
          const filterTooltip = response?.find(
            tip =>
              tip.tooltipName === 'mhv_medications_tooltip_filter_accordion',
          );
          if (filterTooltip) {
            if (filterTooltip.hidden === true) {
              setTooltipVisible(false);
            }
            if (filterTooltip.hidden === false) {
              setTooltipVisible(true);
              setTooltipId(filterTooltip.id);
              incrementTooltipCounter(filterTooltip.id);
            }
          } else {
            createTooltip()
              .then(newTooltipResponse => {
                setTooltipId(newTooltipResponse.id);
                setTooltipVisible(true);
              })
              .catch(error => {
                // eslint-disable-next-line no-console
                console.error('Error creating tooltip:', error);
                setTooltipVisible(false);
              });
          }
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error('Error fetching tooltips:', error);
          setTooltipVisible(false);
        });
    },
    [setTooltipVisible, setTooltipId],
  );

  const handleStopShowing = async () => {
    datadogRum.addAction(
      dataDogActionNames.medicationsListPage.STOP_SHOWING_IPE_FILTERING_HINT,
    );
    await apiHideTooltip(tooltipId);
    setTooltipVisible(false);
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
        </div>
      )}
    </>
  );
};

export default InProductionEducationFiltering;
