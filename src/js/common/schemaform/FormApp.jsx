import React from 'react';
import Scroll from 'react-scroll';

import FormNav from './FormNav';
import FormTitle from './FormTitle';

const Element = Scroll.Element;

/*
 * Primary component for a schema generated form app. Will eventually
 * have the Nav components
 */
export default class FormApp extends React.Component {
  render() {
    const { currentLocation, formConfig, children } = this.props;

    let content;
    if (currentLocation.pathname.endsWith('introduction')) {
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
        <div className="medium-8 columns">
          {formConfig.title && <FormTitle title={formConfig.title} subTitle={formConfig.subTitle}/>}
          {content}
        </div>
        <div className="medium-4 columns show-for-medium-up">
        </div>
        <span className="js-test-location hidden" data-location={currentLocation.pathname} hidden></span>
      </div>
    );
  }
}

