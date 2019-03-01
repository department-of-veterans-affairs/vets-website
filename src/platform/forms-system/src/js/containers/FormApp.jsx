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
  componentWillMount() {
    setGlobalScroll();

    if (window.History) {
      window.History.scrollRestoration = 'manual';
    }
  }

  render() {
    const { currentLocation, formConfig, children, formData } = this.props;
    const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
    const isIntroductionPage = trimmedPathname.endsWith('introduction');
    const Footer = formConfig.footerContent;

    let formTitle;
    let formNav;
    let renderedChildren = children;
    if (!isIntroductionPage) {
      // Show title only if we're not on the intro page and if there is a title
      // specified in the form config
      if (formConfig.title) {
        formTitle = (
          <FormTitle title={formConfig.title} subTitle={formConfig.subTitle} />
        );
      }
    }

    // Show nav only if we're not on the intro, form-saved, error, or confirmation page
    // Also add form classes only if on an actual form page
    if (isInProgress(trimmedPathname)) {
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
    if (Footer) {
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
