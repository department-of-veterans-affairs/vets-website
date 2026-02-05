import React from 'react';
import { Toggler } from 'platform/utilities/feature-toggles';
import PropTypes from 'prop-types';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import {
  NAV_MENU_DROPDOWN,
  NAV_MOBILE_DROPDOWN,
  SIGN_OUT_URL,
} from '../../utilities/constants';

const DropdownLinks = ({ closeDropdown, category }) => {
  const handleClick = e => {
    closeDropdown();
    recordEvent({
      // prettier-ignore
      'event': e.target.dataset.eventname,
      // prettier-ignore
      'custom_string_2': e.target.innerText || e.target.alt,
      'link-destination': e.target.href || e.target.baseURI,
      'link-origin': 'navigation',
    });
  };
  const isAuthorized = localStorage.getItem('userAuthorized');
  return (
    <>
      {category === 'mobile' &&
        NAV_MOBILE_DROPDOWN.map((link, i) => {
          return (
            <li key={i}>
              <a
                href={link.URL}
                onClick={handleClick}
                className="vads-u-color--black"
                data-testid={link.TEST_ID}
                data-eventname="nav-link-click"
              >
                {link.LABEL}
              </a>
            </li>
          );
        })}
      {category === 'mobileDashboard' &&
        NAV_MENU_DROPDOWN.map((link, i) => {
          return link.FEATURE_FLAG_NAME ? (
            <Toggler toggleName={`${link.FEATURE_FLAG_NAME}`} key={i}>
              <Toggler.Enabled>
                <li
                  className={
                    isAuthorized === 'false'
                      ? 'vads-u-display--none'
                      : 'is--authorized'
                  }
                >
                  {link.ICON && (
                    <va-icon
                      icon={link.ICON}
                      size={2}
                      className="people-search-icon"
                    />
                  )}
                  <a
                    href={link.URL}
                    onClick={handleClick}
                    className="nav__mobile-menu-links"
                    data-testid={link.TEST_ID}
                    data-eventname="nav-link-click"
                  >
                    {link.LABEL}
                  </a>
                </li>
              </Toggler.Enabled>
            </Toggler>
          ) : (
            <li
              key={i}
              className={
                isAuthorized === 'false'
                  ? 'vads-u-display--none'
                  : 'is--authorized'
              }
            >
              {link.ICON && (
                <va-icon
                  icon={link.ICON}
                  size={2}
                  className="people-search-icon"
                />
              )}
              <a
                href={link.URL}
                onClick={handleClick}
                className="nav__mobile-menu-links"
                data-testid={link.TEST_ID}
                data-eventname="nav-link-click"
              >
                {link.LABEL}
              </a>
            </li>
          );
        })}
      {category === 'mobileDashboard' && (
        <li>
          <a
            href="/representative/help"
            onClick={handleClick}
            className="nav__mobile-menu-links"
            data-testid="user-nav-help-link"
            data-eventname="nav-link-click"
          >
            Help
          </a>
        </li>
      )}
      {category === 'mobile' && (
        <li>
          <a
            href={SIGN_OUT_URL}
            data-testid="user-nav-sign-out-link"
            onClick={handleClick}
            className="vads-u-color--black"
            data-eventname="nav-header-sign-out"
          >
            Sign Out
          </a>
        </li>
      )}
    </>
  );
};

export default DropdownLinks;

DropdownLinks.propTypes = {
  category: PropTypes.string,
  closeDropdown: PropTypes.func,
};
