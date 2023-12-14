import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { isLoggedIn } from 'platform/user/selectors';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { isInProgress } from 'platform/forms-system/src/js/helpers';
import { setGlobalScroll } from 'platform/forms-system/src/js/utilities/ui';
import FormNav from './CustomFormNav';

const { Element } = Scroll;

/**
 * This is a duplicate of FormApp but allows for passing a customHeader.
 */

/*
 * Primary component for a schema generated form app.
 */
class CustomFormApp extends React.Component {
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

    // Show nav only if we're not on the intro, forms-saved, error, confirmation
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

    let customHeader;
    if (formConfig.CustomHeader) {
      customHeader = (
        <formConfig.CustomHeader
          currentLocation={currentLocation}
          formConfig={formConfig}
          formData={formData}
        />
      );
    }

    return (
      <div>
        <Element name="topScrollElement" />
        {customHeader}
        <div className="row">
          <div className="usa-width-two-thirds medium-8 columns">
            {!customHeader && formTitle}
            {formNav}
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

export default connect(mapStateToProps)(CustomFormApp);

export { CustomFormApp };
