import React from 'react';
import PropTypes from 'prop-types';

import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import NewTabAnchor from '../../components/NewTabAnchor';

const UrgentCareLinks = ({ boldText = false }) => {
  return (
    <>
      <span className={boldText ? 'vads-u-font-weight--bold' : ''}>
        If you need care sooner, use one of these urgent communications options:
      </span>
      <ul>
        <li>
          Call <VaTelephone contact="911" />,{' '}
          <span className="vads-u-font-weight--bold">or</span>
        </li>
        <li>
          Call{' '}
          {
            // eslint-disable-next-line @department-of-veterans-affairs/prefer-telephone-component
            <a data-testid="crisis-hotline-telephone" href="tel:988">
              988 and select 1
            </a>
          }{' '}
          for the Veterans Crisis Line,{' '}
          <span className="vads-u-font-weight--bold">or</span>
        </li>
        <li>
          Go to your nearest emergency room or{' '}
          <NewTabAnchor
            href="/find-locations/?facilityType=urgent_care"
            renderAriaLabel={false}
          >
            urgent care facility (opens in a new tab)
          </NewTabAnchor>
        </li>
      </ul>
    </>
  );
};

UrgentCareLinks.propTypes = {
  boldText: PropTypes.bool,
};

export default UrgentCareLinks;
