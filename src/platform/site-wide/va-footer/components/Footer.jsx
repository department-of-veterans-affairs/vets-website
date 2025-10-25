/* eslint-disable react-hooks/exhaustive-deps */
// Node modules.
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { debounce } from 'lodash';
// Relative imports.
import { langSelectedAction } from 'applications/static-pages/i18Select/actions';
import CrisisPanel from './CrisisPanel';
import DesktopLinks from './DesktopLinks';
import LanguageSupport from './LanguageSupport';
import MobileLinks from './MobileLinks';
import { createLinkGroups } from '../helpers';
import { isWideScreen } from '../../../utilities/accessibility/index';
// import { replaceWithStagingDomain } from '../../../utilities/environment/stagingDomains';

const Footer = ({
  footerData,
  showMinimalFooter,
  dispatchLanguageSelection,
  languageCode,
  onFooterLoad,
}) => {
  const path = useSelector(state => state?.navigation?.route?.path);
  const linkObj = useMemo(() => createLinkGroups(footerData), []);
  const [isMobile, setIsMobile] = useState(!isWideScreen());
  const [isMinimalFooter, setIsMinimalFooter] = useState(
    typeof showMinimalFooter === 'function'
      ? showMinimalFooter(path)
      : showMinimalFooter,
  );

  useEffect(() => {
    const onResize = debounce(() => {
      setIsMobile(!isWideScreen());
    }, 250);

    window.addEventListener('resize', onResize);
    onFooterLoad?.();

    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(
    () => {
      setIsMinimalFooter(
        typeof showMinimalFooter === 'function'
          ? showMinimalFooter(path)
          : showMinimalFooter,
      );
    },
    [showMinimalFooter, path],
  );

  return (
    <div>
      <div className="footer-inner">
        <DesktopLinks visible={!isMinimalFooter && !isMobile} links={linkObj} />
        <MobileLinks
          visible={isMobile}
          links={linkObj}
          langConfig={{ dispatchLanguageSelection, languageCode }}
          minimalFooter={isMinimalFooter}
        />
        {!isMinimalFooter &&
          !isMobile && (
            <LanguageSupport
              isDesktop
              dispatchLanguageSelection={dispatchLanguageSelection}
              languageCode={languageCode}
            />
          )}

        <div className="usa-grid usa-grid-full footer-banner">
          <a href="/" title="Go to VA.gov">
            <img
              src="/img/homepage/va-logo-white.png"
              alt="VA logo and Seal, U.S. Department of Veterans Affairs"
              width="200"
              className="vads-u-height--auto"
            />
          </a>
        </div>
        {!isMinimalFooter && (
          <div className="usa-grid usa-grid-full va-footer-links-bottom">
            {linkObj.bottomLinks}
          </div>
        )}
      </div>
      <CrisisPanel />
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  dispatchLanguageSelection: lang => dispatch(langSelectedAction(lang)),
});

const mapStateToProps = state => ({
  languageCode: state.i18State.lang,
});

Footer.propTypes = {
  footerData: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatchLanguageSelection: PropTypes.func,
  languageCode: PropTypes.string,
  showMinimalFooter: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  onFooterLoad: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Footer);
