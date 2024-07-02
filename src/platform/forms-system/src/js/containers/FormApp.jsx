import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import PropTypes from 'prop-types';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { isLoggedIn } from 'platform/user/selectors';

import BackLink from '../components/BackLink';
import FormNav from '../components/FormNav';
import FormTitle from '../components/FormTitle';
import { isInProgress, hideFormTitle } from '../helpers';
import { setGlobalScroll } from '../utilities/ui';

const { Element } = Scroll;

/*
 * Primary component for a schema generated form app.
 */
class FormApp extends React.Component {
  /* eslint-disable-next-line camelcase */
  UNSAFE_componentWillMount() {
    const { additionalRoutes } = this.props.formConfig;
    this.nonFormPages = [];
    if (additionalRoutes) {
      this.nonFormPages = additionalRoutes.map(route => route.path);
    }

    setGlobalScroll();

    if (window.History) {
      window.History.scrollRestoration = 'manual';
    }
  }

  render() {
    const { currentLocation, formConfig, children, formData } = this.props;
    const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
    const lastPathComponent = currentLocation.pathname.split('/').pop();
    const isIntroductionPage = trimmedPathname.endsWith('introduction');
    const isNonFormPage = this.nonFormPages.includes(lastPathComponent);
    const Footer = formConfig.footerContent;
    const title =
      typeof formConfig.title === 'function'
        ? formConfig.title(this.props)
        : formConfig.title;
    const subTitle =
      typeof formConfig.subTitle === 'function'
        ? formConfig.subTitle(this.props)
        : formConfig.subTitle;
    const { noTitle, noTopNav, fullWidth } = formConfig?.formOptions || {};
    const notProd = !environment.isProduction();
    const hasHiddenFormTitle = hideFormTitle(formConfig, trimmedPathname);
    let useTopBackLink = false;
    const { CustomTopContent } = formConfig;

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

    if (!isNonFormPage) {
      useTopBackLink = formConfig.useTopBackLink;
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
          isLoggedIn={this.props.isLoggedIn}
          inProgressFormId={this.props.inProgressFormId}
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
      notProd && fullWidth ? '' : 'usa-width-two-thirds medium-8 columns';

    return (
      <div>
        <div className={notProd && fullWidth ? '' : 'row'}>
          <div className={wrapperClass}>
            <Element name="topScrollElement" />
            {CustomTopContent && (
              <CustomTopContent currentLocation={currentLocation} />
            )}
            {useTopBackLink && <BackLink />}
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
  }
}

FormApp.propTypes = {
  children: PropTypes.any,
  currentLocation: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  formConfig: PropTypes.shape({
    additionalRoutes: PropTypes.array,
    footerContent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    formOptions: PropTypes.shape({}),
    subTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    CustomTopContent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  }),
  formData: PropTypes.shape({}),
  inProgressFormId: PropTypes.string,
  isLoggedIn: PropTypes.bool,
};

const mapStateToProps = state => ({
  formData: state.form.data,
  isLoggedIn: isLoggedIn(state),
  inProgressFormId: state.form.loadedData?.metadata?.inProgressFormId,
});

export default connect(mapStateToProps)(FormApp);

export { FormApp };
