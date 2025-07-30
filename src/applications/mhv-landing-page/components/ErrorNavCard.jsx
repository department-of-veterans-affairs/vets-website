import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

/**
 * A navigation card only displayed when an error occurs.
 * @param {string} title the title for the navigation card
 * @param {string} iconClasses the icon the card diplays
 * @param {string} code the status code of the related error
 */
const ErrorNavCard = ({
  iconClasses = 'vads-u-margin-right--1p5',
  title,
  code,
  userActionable = false,
}) => {
  const slug = `mhv-c-card-${title.replaceAll(/\W+/g, '-').toLowerCase()}`;
  return (
    <div
      className={classnames(
        'vads-u-height--full',
        'vads-u-padding-x--4',
        'vads-u-padding-top--3',
        'vads-u-padding-bottom--2',
        'vads-u-background-color--gray-lightest',
      )}
    >
      <div className="vads-l-row vads-u-margin-right--neg1">
        <div className="vads-u-display--flex vads-u-align-items--center">
          <div className={`vads-u-flex--auto ${iconClasses}`}>
            <va-icon icon="error" size={4} />
          </div>

          <div className="vads-u-flex--fill vads-u-margin-right--1p5">
            <h2 className="vads-u-margin--0" id={slug}>
              {title}
            </h2>
          </div>
        </div>
      </div>

      {userActionable ? (
        <div>
          <p
            className={classnames(
              'vads-u-padding-left--0',
              'vads-u-margin-top--2',
              'vads-u-margin-bottom--0',
              'vada-u-font-size--md',
            )}
          >
            Error {code}: We can’t give you access to {title.toLowerCase()}
          </p>

          <p
            className={classnames(
              'vads-u-padding-left--0',
              'vads-u-margin-top--2',
              'vads-u-margin-bottom--0',
              'vada-u-font-size--md',
            )}
          >
            Call us at <va-telephone contact="8773270022" />({' '}
            <va-telephone contact={CONTACTS[711]} tty /> ). We’re here Monday
            through Friday, 8:00 a.m. to 8:00 p.m. ET.
          </p>
        </div>
      ) : (
        <div>
          <p
            className={classnames(
              'vads-u-padding-left--0',
              'vads-u-margin-top--2',
              'vads-u-margin-bottom--0',
              'vada-u-font-size--md',
            )}
          >
            We’ve run into a problem and can’t give you access to {title} right
            now.
          </p>
        </div>
      )}
    </div>
  );
};

ErrorNavCard.propTypes = {
  title: PropTypes.string.isRequired,
  code: PropTypes.string,
  iconClasses: PropTypes.string,
};
export default ErrorNavCard;
