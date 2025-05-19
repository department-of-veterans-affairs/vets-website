import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import { getDisplayFriendlyName } from '../utils/helpers';

export function NeedHelp({ item }) {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const cstFriendlyEvidenceRequests = useToggleValue(
    TOGGLE_NAMES.cstFriendlyEvidenceRequests,
  );
  const alias =
    item && item.supportAliases?.length > 0
      ? item.supportAliases.map((name, index) => {
          let separator = null;
          let displayName = name;

          if (index === item.supportAliases.length - 1) {
            displayName = `${name}.`;
          } else if (index === item.supportAliases.length - 2) {
            separator = ' or ';
          } else if (index < item.supportAliases.length - 2 && index >= 0) {
            separator = ', ';
          }

          return (
            <Fragment key={index}>
              <span className="vads-u-font-weight--bold">“{displayName}”</span>
              {separator}
            </Fragment>
          );
        })
      : null;

  return (
    <va-need-help class="vads-u-margin-top--9">
      <div slot="content">
        <p>
          Call the VA benefits hotline at <va-telephone contact="8008271000" />.
          We're here Monday through Friday, 8:00 a.m to 9:00 p.m ET. If you have
          hearing loss, <va-telephone contact="711" tty="true" />.
        </p>
        {cstFriendlyEvidenceRequests &&
          alias && (
            <p>
              The VA benefits hotline may refer to the “
              {getDisplayFriendlyName(item)}” request as {alias}
            </p>
          )}
      </div>
    </va-need-help>
  );
}

NeedHelp.propTypes = {
  item: PropTypes.object,
};
export default NeedHelp;
