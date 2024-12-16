import React from 'react';
import { Trans } from 'react-i18next';

// OMB Details
const EXP_DATE = '11/30/2027';
const OMB_NUMBER = '2900-0798';
const RES_BURDEN_MIN = '10';

const TravelPayOMB = () => {
  return (
    <va-omb-info
      exp-date={EXP_DATE}
      omb-number={OMB_NUMBER}
      res-burden={RES_BURDEN_MIN}
      data-testid="travel-pay-omb"
      class="vads-u-margin-y--4"
    >
      <p data-testid="travel-pay-omb-burdern-statement">
        <Trans
          i18nKey="travel-pay-omb-burdern-statement"
          components={[
            <strong key="bold" />,
            <a
              key="link"
              href="mailto:VACOPaperworkReduAct@va.gov"
              target="_blank"
              rel="noreferrer"
            >
              VACOPaperworkReduAct@va.gov
            </a>,
          ]}
          values={{
            ombNumber: OMB_NUMBER,
            expDate: EXP_DATE,
            resBurden: RES_BURDEN_MIN,
          }}
        />
      </p>

      <p data-testid="travel-pay-omb-privacy-act-info">
        <Trans
          i18nKey="travel-pay-omb-privacy-act"
          components={[<strong key="bold" />]}
        />
      </p>
    </va-omb-info>
  );
};

export default TravelPayOMB;
