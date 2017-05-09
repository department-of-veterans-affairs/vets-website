import React from 'react';
import Scroll from 'react-scroll';

import FormNav from './FormNav';
import FormTitle from './FormTitle';

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
    const isIntro = trimmedPathname.endsWith('introduction');
    const isConfirmation = trimmedPathname.endsWith('confirmation');
    let message;
    if (!(isIntro || isConfirmation)) {
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
    const isIntro = trimmedPathname.endsWith('introduction');
    const isConfirmation = trimmedPathname.endsWith('confirmation');

    let content;
    if (isIntro || isConfirmation) {
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
      <div className="row">
        <Element name="topScrollElement"/>
        <div className="usa-width-two-thirds medium-8 columns">
          {formConfig.title && !isIntro && <FormTitle title={formConfig.title} subTitle={formConfig.subTitle}/>}
          {content}
        </div>
        <div className="usa-width-one-third medium-4 columns show-for-medium-up">
        </div>
        <span className="js-test-location hidden" data-location={trimmedPathname} hidden></span>
      </div>
    );
  }
}
