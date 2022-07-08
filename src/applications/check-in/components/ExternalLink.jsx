import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

function ExternalLink({ children, href, hrefLang, onClick = null }) {
  const { t, i18n } = useTranslation();
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <a {...{ href, hrefLang, onClick }}>
      {children}
      {!i18n?.language.startsWith(hrefLang) ? (
        <> ({t(`in-${hrefLang}`)})</>
      ) : null}
    </a>
  );
}

ExternalLink.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string,
  hrefLang: PropTypes.string,
  onClick: PropTypes.func,
};

export default ExternalLink;
