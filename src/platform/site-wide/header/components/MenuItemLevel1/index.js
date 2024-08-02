import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import recordEvent from '~/platform/monitoring/record-event';
import MenuItemLevel2 from '../MenuItemLevel2';
import { deriveMenuItemID, formatMenuItems } from '../../helpers';
import { updateExpandedMenuIDAction } from '../../containers/Menu/actions';

export const MenuItemLevel1 = ({
  expandedMenuID,
  item,
  updateExpandedMenuID,
}) => {
  const menuItemID = deriveMenuItemID(item, '1');
  const isExpanded = menuItemID === expandedMenuID;

  if (!item?.menuSections && !item?.href && !item?.title) {
    return null;
  }

  if (item?.menuSections) {
    item.menuSections = formatMenuItems(item.menuSections); // eslint-disable-line no-param-reassign
  }

  const toggleShowItems = title => () => {
    recordEvent({
      event: 'nav-header-top-level',
      'nav-header-action': `Navigation - Header - Open Top Level - ${title}`,
    });

    updateExpandedMenuID(isExpanded ? undefined : menuItemID);

    const header = document.querySelector('header');

    if (header) {
      header.scrollIntoView();
    }
  };

  return (
    <li className="vads-u-background-color--primary-dark vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold">
      {/* Raw title */}
      {!item?.menuSections &&
        !item?.href && (
          <span className="vads-u-display--flex vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full">
            {item?.title}
          </span>
        )}
      {/* Title link */}
      {!item?.menuSections &&
        item?.href && (
          <a
            className="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full"
            href={item?.href}
          >
            {item?.title}
          </a>
        )}
      {item?.menuSections && (
        <>
          {/* Expand title */}
          <button
            aria-expanded={isExpanded ? 'true' : 'false'}
            className="header-menu-item-button vads-u-background-color--primary-dark vads-u-display--flex vads-u-align-items--center vads-u-justify-content--space-between vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white"
            data-e2e-id={menuItemID}
            id={menuItemID}
            onClick={toggleShowItems(item?.title)}
            type="button"
          >
            {item?.title}
            {isExpanded ? (
              <>
                {/* minus icon */}
                {/* Convert to va-icon when injected header/footer split is in prod: https://github.com/department-of-veterans-affairs/vets-website/pull/27590 */}
                <svg
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 2 20 20"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#fff"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19 13H5V11H19V13Z"
                  />
                </svg>
              </>
            ) : (
              <>
                {/* plus icon */}
                {/* Convert to va-icon when injected header/footer split is in prod: https://github.com/department-of-veterans-affairs/vets-website/pull/27590 */}
                <svg
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 2 20 20"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#fff"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                  />
                </svg>
              </>
            )}
          </button>
          {/* Level 2 menu items */}
          {isExpanded && (
            <ul
              aria-label={item?.title}
              className="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column usa-unstyled-list vads-u-margin--0 vads-u-padding--0"
              id={menuItemID}
            >
              {item?.menuSections.map(itemLevel2 => {
                const itemLevel2ID = deriveMenuItemID(itemLevel2, '2');
                return <MenuItemLevel2 key={itemLevel2ID} item={itemLevel2} />;
              })}
            </ul>
          )}
        </>
      )}
    </li>
  );
};

MenuItemLevel1.propTypes = {
  item: PropTypes.shape({
    href: PropTypes.string,
    menuSections: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    title: PropTypes.string.isRequired,
  }),
};

const mapStateToProps = state => ({
  expandedMenuID: state.headerMenuReducer.expandedMenuID,
});

const mapDispatchToProps = dispatch => ({
  updateExpandedMenuID: menuItemID =>
    dispatch(updateExpandedMenuIDAction(menuItemID)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MenuItemLevel1);
