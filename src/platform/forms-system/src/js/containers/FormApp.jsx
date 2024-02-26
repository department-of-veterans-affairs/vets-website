import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';

import FormNav from '../components/FormNav';
import FormTitle from '../components/FormTitle';
import { isInProgress } from '../helpers';
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
    const isPageNotFound =
      // eslint-disable-next-line react/prop-types
      children && children.type && children.type === PageNotFound;
    const isNonFormPage =
      this.nonFormPages.includes(lastPathComponent) || isPageNotFound;
    const Footer = formConfig.footerContent;
    const title =
      typeof formConfig.title === 'function'
        ? formConfig.title(this.props)
        : formConfig.title;
    const { noTitle, noTopNav, fullWidth } = formConfig?.formOptions || {};
    const notProd = !environment.isProduction();

    let formTitle;
    let formNav;
    let renderedChildren = children;
    // Show title only if:
    // 1. we're not on the intro page *or* one of the additionalRoutes
    //    specified in the form config
    // 2. there is a title specified in the form config
    if (!isIntroductionPage && !isNonFormPage && title) {
      formTitle = <FormTitle title={title} subTitle={formConfig.subTitle} />;
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
      (notProd && fullWidth) || isPageNotFound
        ? ''
        : 'usa-width-two-thirds medium-8 columns';

    return (
      <div>
        <div className={notProd && fullWidth ? '' : 'row'}>
          <div className={wrapperClass}>
            <Element name="topScrollElement" />
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

const mapStateToProps = state => ({
  formData: state.form.data,
  isLoggedIn: isLoggedIn(state),
  inProgressFormId: state.form.loadedData?.metadata?.inProgressFormId,
});

export default connect(mapStateToProps)(FormApp);

export { FormApp };
