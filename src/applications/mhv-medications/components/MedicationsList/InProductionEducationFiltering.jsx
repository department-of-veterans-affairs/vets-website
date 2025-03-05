import React from 'react';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { dataDogActionNames } from '../../util/dataDogConstants';

const InProductionEducationFiltering = () => {
  return (
    <div data-testid="rx-ipe-filtering-container">
      <p>
        Filter the medications list to easily find what you are looking for.
      </p>
      <VaButton
        className="vads-u-width--full tablet:vads-u-width--auto vads-u-margin-top--3"
        secondary
        text="Stop showing this hint"
        data-testid="rx-ipe-filtering-stop-showing-this-hint"
        data-dd-action-name={
          dataDogActionNames.medicationsListPage.STOP_SHOWING_IPE_FILTERING_HINT
        }
      />
    </div>
  );
};

export default InProductionEducationFiltering;
