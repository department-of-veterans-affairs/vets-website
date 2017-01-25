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
      <div className="usa-grid">
        <Element name="topScrollElement"/>
        <div className="usa-grid-one-third columns show-for-medium-up">
        </div>
        <div className="usa-width-three-fourths">
          <div className="progress-box">
            {this.props.children}
          </div>
        </div>
        <span className="js-test-location hidden" data-location={currentLocation.pathname} hidden></span>
      </div>
    );
  }
}

