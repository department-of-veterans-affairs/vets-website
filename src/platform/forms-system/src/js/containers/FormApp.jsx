import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import { Element, watchErrorUpdates } from 'platform/utilities/scroll';
import { isLoggedIn } from 'platform/user/selectors';

import BackLink from '../components/BackLink';
import FormNav from '../components/FormNav';
import FormTitle from '../components/FormTitle';
import { isInProgress, hideFormTitle } from '../helpers';
import { setGlobalScroll } from '../utilities/ui';
import {
  isMinimalHeaderApp,
  isMinimalHeaderPath,
} from '../patterns/minimal-header';

/*
 * Primary component for a schema generated form app.
 */
const FormApp = props => {
  const { currentLocation, formConfig, children, formData } = props;
  const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
  const lastPathComponent = currentLocation.pathname.split('/').pop();
  const { additionalRoutes, CustomTopContent } = formConfig;

  useEffect(() => {
    setGlobalScroll();

    if (window.History) {
      window.History.scrollRestoration = 'manual';
    }

    // Start watching for error attribute changes to update screen reader annotations
    // when scaffoldAndFocusFormErrors is true
    const stopWatchingErrors = watchErrorUpdates(
      formConfig?.formOptions?.scaffoldAndFocusFormErrors,
    );

    return () => {
      stopWatchingErrors();
    };
  }, []);

  useEffect(
    () => {
      // Set current location in data-location for custom CSS
      document.body.dataset.location = currentLocation.pathname.slice(1);
    },
    [currentLocation.pathname],
  );

  const nonFormPages = additionalRoutes
    ? additionalRoutes.map(route => route.path)
    : [];

  const isIntroductionPage = trimmedPathname.endsWith('introduction');
  const isConfirmationPage = trimmedPathname.endsWith('confirmation');
  const isNonFormPage = nonFormPages.includes(lastPathComponent);
  const Footer = formConfig.footerContent;
  const title =
    typeof formConfig.title === 'function'
      ? formConfig.title(props)
      : formConfig.title;
  const subTitle =
    typeof formConfig.subTitle === 'function'
      ? formConfig.subTitle(props)
      : formConfig.subTitle;
  const { noTitle, noTopNav, fullWidth } = formConfig?.formOptions || {};
  const notProd = !environment.isProduction();
  const hasHiddenFormTitle = hideFormTitle(
    formConfig,
    trimmedPathname,
    formData,
  );
  let useTopBackLink = false;

  let formTitle;
  let formNav;
  let renderedChildren = children;
  // Show title only if:
  // 1. we're not on the intro page *or* one of the additionalRoutes
  //    specified in the form config
  // 2. there is a title specified in the form config
  if (!isIntroductionPage && !isNonFormPage && !hasHiddenFormTitle && title) {
    formTitle = <FormTitle title={title} subTitle={subTitle} />;
  }
  if (formConfig.useTopBackLink) {
    if (isMinimalHeaderApp()) {
      useTopBackLink = isMinimalHeaderPath(currentLocation.pathname);
    } else {
      // useTopBackLink if we're not on one of the additionalRoutes *and* the confirmation page
      useTopBackLink = !isNonFormPage && !isConfirmationPage;
    }
  }

  // Show nav only if we're not on the intro, form-saved, error, confirmation
  // page or one of the additionalRoutes specified in the form config
  // Also add form classes only if on an actual form page
  if (!isNonFormPage && isInProgress(trimmedPathname)) {
    formNav = (
      <FormNav
        formData={formData}
        formConfig={formConfig}
        currentPath={trimmedPathname}
        isLoggedIn={props.isLoggedIn}
        inProgressFormId={props.inProgressFormId}
      />
    );

    renderedChildren = (
      <div className="progress-box progress-box-schemaform">{children}</div>
    );
  }

  let footer;
  if (Footer && !isNonFormPage) {
    footer = (
      <Footer formConfig={formConfig} currentLocation={currentLocation} />
    );
  }
  const wrapperClass =
    notProd && fullWidth
      ? ''
      : 'usa-width-two-thirds medium-8 columns print-full-width';

  return (
    <div className="form-app">
      <div className={notProd && fullWidth ? '' : 'row'}>
        <div className={wrapperClass}>
          <Element name="topScrollElement" />
          {CustomTopContent && (
            <CustomTopContent currentLocation={currentLocation} />
          )}
          {useTopBackLink && (
            <BackLink
              text={formConfig?.backLinkText}
              dynamicPaths={formConfig.dynamicPaths}
            />
          )}
          {notProd && noTitle ? null : formTitle}
          {notProd && noTopNav ? null : formNav}
          <Element name="topContentElement" />
          {renderedChildren}
        </div>
      </div>
      {footer}
      <span
        className="js-test-location hidden"
        data-location={trimmedPathname}
        hidden
      />
    </div>
  );
};

FormApp.propTypes = {
  additionalRoutes: PropTypes.array,
  children: PropTypes.any,
  currentLocation: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  formConfig: PropTypes.shape({
    additionalRoutes: PropTypes.array,
    backLinkText: PropTypes.string,
    footerContent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    formOptions: PropTypes.shape({
      scaffoldAndFocusFormErrors: PropTypes.bool,
    }),
    subTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    useTopBackLink: PropTypes.bool,
    CustomTopContent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  }),
  formData: PropTypes.shape({}),
  inProgressFormId: PropTypes.number,
  isLoggedIn: PropTypes.bool,
};

const mapStateToProps = state => ({
  formData: state.form.data,
  isLoggedIn: isLoggedIn(state),
  inProgressFormId: state?.form?.inProgressFormId,
});

export default connect(mapStateToProps)(FormApp);

export { FormApp };
