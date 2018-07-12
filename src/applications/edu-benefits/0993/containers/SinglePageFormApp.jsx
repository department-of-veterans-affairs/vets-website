import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import FormTitle from 'us-forms-system/lib/js/components/FormTitle';
import { setGlobalScroll } from 'us-forms-system/lib/js/utilities/ui';

const Element = Scroll.Element;

/*
 * Primary component for a schema generated form app.
 */
class SinglePageFormApp extends React.Component {
  componentWillMount() {
    setGlobalScroll();

    if (window.History) {
      window.History.scrollRestoration = 'manual';
    }
  }

  render() {
    const { currentLocation, formConfig, children } = this.props;
    const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
    const isIntroductionPage = trimmedPathname.endsWith('introduction');
    const Footer = formConfig.footerContent;

    let formTitle;
    if (!isIntroductionPage) {
      // Show title only if we're not on the intro page and if there is a title
      // specified in the form config
      if (formConfig.title) {
        formTitle = <FormTitle title={formConfig.title} subTitle={formConfig.subTitle}/>;
      }
    }

    let footer;
    if (Footer) {
      footer = (
        <Footer
          formConfig={formConfig}
          currentLocation={currentLocation}/>
      );
    }

    return (
      <div>
        <div className="row">
          <div className="usa-width-two-thirds medium-8 columns">
            <Element name="topScrollElement"/>
            {formTitle}
            {children}
          </div>
        </div>
        {footer}
        <span className="js-test-location hidden" data-location={trimmedPathname} hidden></span>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  formData: state.form.data
});

export default connect(mapStateToProps)(SinglePageFormApp);

export { SinglePageFormApp };
