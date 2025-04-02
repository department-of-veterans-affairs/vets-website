import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

export function NeedHelp({ item }) {
  const alias =
    item && item.supportAliases?.length > 0
      ? item.supportAliases.map((name, index) => {
          let separator = null;

          if (index === item.supportAliases.length - 2) {
            separator = ' or ';
          } else if (index < item.supportAliases.length - 2 && index >= 0) {
            separator = ', ';
          }

          return (
            <Fragment key={index}>
              <span className="vads-u-font-weight--bold">"{name}"</span>
              {separator}
            </Fragment>
          );
        })
      : null;

  return (
    <va-need-help class="vads-u-margin-top--9">
      <div slot="content">
        <p>
          Call us at <va-telephone contact="8008271000" />. We're here Monday
          through Friday, 8:00 a.m to 9:00 p.m ET. If you have hearing loss,{' '}
          <va-telephone contact="711" tty="true" />.
        </p>
        {alias && (
          <p>
            The VA benefits hotline may refer to the “{item.friendlyName}”
            request as {alias}.
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
