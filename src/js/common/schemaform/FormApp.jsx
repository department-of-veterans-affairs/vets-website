import React from 'react';
import Scroll from 'react-scroll';

import _ from 'lodash';

import FormNav from './FormNav';
import FormTitle from './FormTitle';

const Element = Scroll.Element;

/*
 * Primary component for a schema generated form app. Will eventually
 * have the Nav components
 */
export default class FormApp extends React.Component {
  componentWillMount() {
    window.addEventListener('beforeunload', this.onbeforeunload);
  }

  // I'm not convinced this is ever executed
  componentWillUnmount() {
    this.removeOnbeforeunload();
  }

  onbeforeunload = e => {
    const endpoint = this.props.currentLocation.pathname.split('/').pop();
    let message;
    if (!_.includes(['introduction', 'confirmation'], endpoint)) {
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
    const isIntro = currentLocation.pathname.endsWith('introduction');
    const isConfirmation = currentLocation.pathname.endsWith('confirmation');

    let content;
    if (isIntro || isConfirmation) {
      content = children;
    } else {
      content = (
        <div>
          <FormNav formConfig={formConfig} currentPath={currentLocation.pathname}/>
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
        <span className="js-test-location hidden" data-location={currentLocation.pathname} hidden></span>
      </div>
    );
  }
}
