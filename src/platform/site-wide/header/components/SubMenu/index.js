import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import recordEvent from '~/platform/monitoring/record-event';
import { deriveMenuItemID, formatSubMenuSections } from '../../helpers';
import { updateSubMenuAction } from '../../containers/Menu/actions';

export const SubMenu = ({ subMenu, updateSubMenu }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById('header-back-to-menu')?.focus?.();
  }, []);

  const onBack = () => {
    recordEvent({ event: 'nav-header-back-to-menu' });
    updateSubMenu();
  };

  const formattedMenuSections = formatSubMenuSections(subMenu?.menuSections);

  return (
    <div className="header-menu vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding--0 vads-u-width--full">
      <ul className="vads-u-background-color--gray-lightest vads-u-display--flex vads-u-flex-direction--column usa-unstyled-list vads-u-margin--0 vads-u-padding--0">
        <li className="vads-u-background-color--gray-lightest vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold">
          <button
            className="header-menu-item-button vads-u-background-color--gray-lightest vads-u-display--flex vads-u-width--full vads-u-text-decoration--none vads-u-margin--0 vads-u-padding--2 vads-u-color--link-default vads-u-align-items--center"
            id="header-back-to-menu"
            onClick={onBack}
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
          const menuItemID = deriveMenuItemID(item, '3');

          return (
            <li
              className="vads-u-background-color--primary-darker vads-u-margin--0 vads-u-margin-bottom--0p5 vads-u-width--full vads-u-font-weight--bold"
              data-e2e-id={item?.text?.replaceAll(' ', '-')}
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
                    data-e2e-id={item?.text
                      ?.replaceAll(' ', '-')
                      ?.replaceAll(/[{(,&)}]/g, '')
                      .toLowerCase()}
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
  updateSubMenu: PropTypes.func.isRequired,
  subMenu: PropTypes.shape({
    id: PropTypes.string.isRequired,
    menuSections: PropTypes.arrayOf(PropTypes.object),
  }),
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
