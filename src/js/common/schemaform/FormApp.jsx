import React from 'react';
import Scroll from 'react-scroll';

import FormNav from './FormNav';

const Element = Scroll.Element;

/*
 * Primary component for a schema generated form app. Will eventually
 * have the Nav components
 */
export default class FormApp extends React.Component {
  render() {
    const { currentLocation, formConfig } = this.props;
    return (
      <div className="row">
        <Element name="topScrollElement"/>
        <div className="medium-8 columns">
          <FormNav formConfig={formConfig} currentPath={currentLocation.pathname}/>
          <div className="progress-box progress-box-schemaform">
            {this.props.children}
          </div>
        </div>
        <div className="medium-4 columns show-for-medium-up">
        </div>
        <span className="js-test-location hidden" data-location={currentLocation.pathname} hidden></span>
      </div>
    );
  }
}

