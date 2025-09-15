import React from 'react';
import { Link } from 'react-router-dom';
import { Toggler } from 'platform/utilities/feature-toggles';
import {
  NAV_MENU_DROPDOWN,
  NAV_MOBILE_DROPDOWN,
  SIGN_OUT_URL,
} from '../../utilities/constants';

const DropdownLinks = ({ closeDropdown, category }) => {
  const handleClick = () => {
    closeDropdown();
  };

  return (
    <>
      {category === 'mobile' &&
        NAV_MOBILE_DROPDOWN.map((link, i) => {
          return (
            <li key={i}>
              <Link
                to={link.URL}
                onClick={handleClick}
                className="vads-u-color--black"
              >
                {link.LABEL}
              </Link>
            </li>
          );
        })}
      {category === 'mobileDashboard' &&
        NAV_MENU_DROPDOWN.map((link, i) => {
          return link.FEATURE_FLAG_NAME ? (
            <Toggler toggleName={`${link.FEATURE_FLAG_NAME}`} key={i}>
              <Toggler.Enabled>
                <li>
                  {link.ICON && (
                    <va-icon
                      icon={link.ICON}
                      size={2}
                      className="people-search-icon"
                    />
                  )}
                  <Link to={link.URL} onClick={handleClick}>
                    {link.LABEL}
                  </Link>
                </li>
              </Toggler.Enabled>
            </Toggler>
          ) : (
            <li key={i}>
              {link.ICON && (
                <va-icon
                  icon={link.ICON}
                  size={2}
                  className="people-search-icon"
                />
              )}
              <Link
                to={link.URL}
                onClick={handleClick}
                className="vads-u-color--black"
              >
                {link.LABEL}
              </Link>
            </li>
          );
        })}
      {category === 'mobile' && (
        <li>
          <a
            href={SIGN_OUT_URL}
            onClick={handleClick}
            className="vads-u-color--black"
          >
            Sign Out
          </a>
        </li>
      )}
    </>
  );
};

export default DropdownLinks;
