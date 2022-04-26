import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

function ExternalLink({ children, href, hrefLang }) {
  const { t, i18n } = useTranslation();
  return (
    <a {...{ href, hrefLang }}>
      {children}
      {hrefLang !== i18n?.resolvedLanguage ? (
        <> ({t(`in-${hrefLang}`)})</>
      ) : null}
    </a>
  );
}

ExternalLink.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string,
  hrefLang: PropTypes.string,
};

export default ExternalLink;
