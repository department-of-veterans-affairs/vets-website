import React from 'react';
import Scroll from 'react-scroll';

const Element = Scroll.Element;

/*
 * Primary component for a schema generated form app. Will eventually
 * have the Nav components
 */
export default class FormApp extends React.Component {
  render() {
    const { currentLocation } = this.props;
    return (
      <div className="row">
        <Element name="topScrollElement"/>
        <div className="medium-4 columns show-for-medium-up">
        </div>
        <div className="medium-8 columns">
          <div className="progress-box">
            {this.props.children}
          </div>
        </div>
        <span className="js-test-location hidden" data-location={currentLocation.pathname} hidden></span>
      </div>
    );
  }
}

