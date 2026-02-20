import React from 'react';
import PropTypes from 'prop-types';
import { serviceStatuses } from '../constants';

const UploadInformation = props => {
  const { hasOneTimeRestoration, formData } = props;

  const showStatementOfService = [
    serviceStatuses.VETERAN,
    serviceStatuses.ADSM,
    serviceStatuses.NADNA,
  ].includes(formData?.identity);
  if (!showStatementOfService && !props.hasOneTimeRestoration) {
    return null;
  }

  return (
    <va-accordion data-testid="document-upload-accordion">
      {showStatementOfService && (
        <va-accordion-item open>
          <h3 slot="headline">Statement of service</h3>
          <p>
            The statement of service can be signed by, or by direction of, the
            adjutant, personnel officer, or commander of your unit or higher
            headquarters. The statement may be in any format; usually a standard
            or bulleted memo is sufficient. It should identify you by name and
            social security number and provide: (1) your date of entry on your
            current active-duty period and (2) the duration of any time lost (or
            a statement noting there has been no time lost). Generally, this
            should be on military letterhead.
          </p>
        </va-accordion-item>
      )}
      {hasOneTimeRestoration && (
        <va-accordion-item open>
          <h3 slot="headline">Type of evidence of a VA loan paid in full</h3>
          <p>
            Evidence can be in the form of a paid-in-full statement from the
            former lender, a satisfaction of mortgage from the clerk of court in
            the county where the home is located, or a copy of the HUD-1 or
            Closing Disclosure settlement statement completed in connection with
            a sale of the home or refinance of the prior loan. Many counties
            post public documents like the satisfaction of mortgage online.
          </p>
        </va-accordion-item>
      )}
    </va-accordion>
  );
};

UploadInformation.propTypes = {
  formData: PropTypes.object,
  hasOneTimeRestoration: PropTypes.bool,
};

export default UploadInformation;
