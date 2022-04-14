import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

function LinkTranslation({ children, href, hrefLang }) {
  const { t, i18n } = useTranslation();
  return (
    <a {...{ href, hrefLang }}>
      {children}{' '}
      {hrefLang !== i18n.language ? <>({t(`in-${hrefLang}`)})</> : null}
    </a>
  );
}

LinkTranslation.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string,
  hrefLang: PropTypes.string,
};

export default LinkTranslation;
