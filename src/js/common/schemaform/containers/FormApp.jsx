import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import FormNav from '../components/FormNav';
import FormTitle from '../components/FormTitle';
import AskVAQuestions from '../components/AskVAQuestions';
import RoutedSavableApp from '../save-in-progress/RoutedSavableApp';

const Element = Scroll.Element;

/*
 * Primary component for a schema generated form app.
 */
class FormApp extends React.Component {
  componentWillMount() {
    if (window.History) {
      window.History.scrollRestoration = 'manual';
    }
  }

  render() {
    // NOTE: children have a `params` prop which contains `index`
    //  Might come from RoutedSavableApp?
    const { currentLocation, formConfig, children, formData } = this.props;
    const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
    const isIntroductionPage = trimmedPathname.endsWith('introduction');
    const isConfirmationPage = trimmedPathname.endsWith('confirmation');
    const GetFormHelp = formConfig.getHelp;
    const saveEnabled = !formConfig.disableSave;

    let formTitle;
    let formNav;
    if (!isIntroductionPage) {
      // Show nav only if we're not on the intro or confirmation page
      if (!isConfirmationPage) {
        formNav = <FormNav formData={formData} formConfig={formConfig} currentPath={trimmedPathname}/>;
      }
      // Show title only if we're not on the intro page and if there is a title
      // specified in the form config
      if (formConfig.title) {
        formTitle = <FormTitle title={formConfig.title} subTitle={formConfig.subTitle}/>;
      }
    }

    return (
      <div>
        <div className="row">
          <div className="usa-width-two-thirds medium-8 columns">
            {
              saveEnabled ?
                (
                  <RoutedSavableApp
                    formConfig={formConfig}
                    currentLocation={currentLocation}>
                    {children}
                  </RoutedSavableApp>
                ) :
                (
                  <div>
                    <Element name="topScrollElement"/>
                    {formTitle}
                    {formNav}
                    <div className="progress-box progress-box-schemaform">
                      {children}
                    </div>
                  </div>
                )
            }
          </div>
        </div>
        {!isConfirmationPage && <AskVAQuestions>
          {!!GetFormHelp && <GetFormHelp/>}
        </AskVAQuestions>}
        <span className="js-test-location hidden" data-location={trimmedPathname} hidden></span>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  formData: state.form.data
});

export default connect(mapStateToProps)(FormApp);

export { FormApp };
