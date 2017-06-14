import React from 'react';
import Scroll from 'react-scroll';

import FormNav from './FormNav';
import FormTitle from './FormTitle';
import AskVAQuestions from './AskVAQuestions';


import { isInProgress } from '../utils/helpers';

const Element = Scroll.Element;

/*
 * Primary component for a schema generated form app.
 */
export default class FormApp extends React.Component {
  componentWillMount() {
    window.addEventListener('beforeunload', this.onbeforeunload);
    if (window.History) {
      window.History.scrollRestoration = 'manual';
    }
  }

  // I'm not convinced this is ever executed
  componentWillUnmount() {
    this.removeOnbeforeunload();
  }

  onbeforeunload = e => {
    const { currentLocation } = this.props;
    const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');

    let message;
    if (isInProgress(trimmedPathname)) {
      message = 'Are you sure you wish to leave this application? All progress will be lost.';
      // Chrome requires this to be set
      e.returnValue = message;     // eslint-disable-line no-param-reassign
    }
    return message;
  }

  removeOnbeforeunload = () => {
    window.removeEventListener('beforeunload', this.onbeforeunload);
  }

  render() {
    const { currentLocation, formConfig, children } = this.props;
    const trimmedPathname = currentLocation.pathname.replace(/\/$/, '');
    const isIntroductionPage = trimmedPathname.endsWith('introduction');
    const isConfirmationPage = trimmedPathname.endsWith('confirmation');
    const GetFormHelp = formConfig.getHelp;
    let content;
    if (!isInProgress(trimmedPathname)) {
      content = children;
    } else {
      content = (
        <div>
          <FormNav formConfig={formConfig} currentPath={trimmedPathname}/>
          <div className="progress-box progress-box-schemaform">
            {children}
          </div>
        </div>
      );
    }


    return (
      <div>
        <div className="row">
          <Element name="topScrollElement"/>
          <div className="usa-width-two-thirds medium-8 columns">
            {formConfig.title && !isIntroductionPage && <FormTitle title={formConfig.title} subTitle={formConfig.subTitle}/>}
            {content}
          </div>
        </div>
        {!isConfirmationPage && <AskVAQuestions>
          <GetFormHelp/>
        </AskVAQuestions>}
        <span className="js-test-location hidden" data-location={trimmedPathname} hidden></span>
      </div>
    );
  }
}
