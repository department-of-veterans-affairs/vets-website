import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import FormNav from '../components/FormNav';
import FormTitle from '../components/FormTitle';
import { isInProgress } from '../helpers';
import { setGlobalScroll } from '../utilities/ui';

const Element = Scroll.Element;

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

    let formTitle;
    let formNav;
    let renderedChildren = children;
    // Show title only if:
    // 1. we're not on the intro page *or* one of the additionalRoutes
    //    specified in the form config
    // 2. there is a title specified in the form config
    if (!isIntroductionPage && !isNonFormPage && formConfig.title) {
      formTitle = (
        <FormTitle title={formConfig.title} subTitle={formConfig.subTitle} />
      );
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

    return (
      <div>
        <div className="row">
          <div className="usa-width-two-thirds medium-8 columns">
            <Element name="topScrollElement" />
            {formTitle}
            {formNav}
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
});

export default connect(mapStateToProps)(FormApp);

export { FormApp };
