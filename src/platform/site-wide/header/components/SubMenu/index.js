// Node modules.
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import { deriveMenuItemID, formatSubMenuSections } from '../../helpers';
import { updateSubMenuAction } from '../../containers/Menu/actions';

export const SubMenu = ({ subMenu, updateSubMenu }) => {
  useEffect(() => {
    // Scroll to the top when the sub menu is opened.
    window.scrollTo(0, 0);

    // Focus back to menu button.
    document.getElementById('header-back-to-menu')?.focus?.();
  }, []);

  const onBack = () => {
    updateSubMenu();
  };

  // Format the menu sections.
  const formattedMenuSections = formatSubMenuSections(subMenu?.menuSections);

  return (
    <div className="header-menu vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0 vads-u-width--full">
      <ul className="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column usa-unstyled-list vads-u-margin--0 vads-u-padding--0">
        <li className="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold">
          <button
            className="header-menu-item-button vads-u-background-color--gray-lightest vads-u-display--flex vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default vads-u-align-items--center"
            id="header-back-to-menu"
            onKeyDown={event => event.keyCode === 13 && onBack()}
            onMouseUp={onBack}
            type="button"
          >
            <i
              aria-hidden="true"
              className="fa fa-chevron-left vads-u-margin-right--1 vads-u-font-size--lg"
            />
            Back to menu
          </button>
        </li>

        {formattedMenuSections?.map(item => {
          // Derive the menu item ID.
          const menuItemID = deriveMenuItemID(item, '3');

          return (
            <li
              className="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold"
              key={menuItemID}
            >
              {/* Raw title */}
              {!item?.links &&
                !item?.href && (
                  <span className="vads-u-display--flex vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full">
                    {item?.text}
                  </span>
                )}

              {/* Title link */}
              {!item?.links &&
                item?.href && (
                  <a
                    className="vads-u-display--flex vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--white vads-u-width--full"
                    href={item?.href}
                  >
                    {item?.text}
                  </a>
                )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

SubMenu.propTypes = {
  // From mapStateToProps.
  subMenu: PropTypes.shape({
    id: PropTypes.string.isRequired,
    menuSections: PropTypes.arrayOf(PropTypes.object),
  }),
  // From mapDispatchToProps.
  updateSubMenu: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  subMenu: state.headerMenuReducer.subMenu,
});

const mapDispatchToProps = dispatch => ({
  updateSubMenu: subMenu => dispatch(updateSubMenuAction(subMenu)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SubMenu);
