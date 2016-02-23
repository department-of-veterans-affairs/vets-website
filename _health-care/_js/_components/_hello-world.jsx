import React from 'react';
import { IndexLink, Link } from 'react-router'

import DateInput from './date_input';
import FullName from './full_name';
import MothersMaidenName from './mothers_maiden_name';

class Nav extends React.Component {
  render() {
    return (
      <div>
        <Link to="/hello">Hello</Link><br/>
        <Link to="/night">Night</Link><br/>
        <IndexLink to="/">Home</IndexLink>
      </div>
    )
  }
}

class Hello extends React.Component {
  render() {
    return(
      <div>
        <h2>Hello World</h2>

        <div className="row">
          <h3>Happy Date</h3>
          <DateInput date={this.props.applicationData.happyDate}
            onUserInput={(update) => {this.props.onStateChange('happyDate', update);} } />
        </div>
        <div className="row">
          <h3>Sad Date</h3>
          <DateInput date={this.props.applicationData.sadDate}
            onUserInput={(update) => {this.props.onStateChange('sadDate', update);} } />
        </div>

        <div className="row">
          <h4>Veteran's Name</h4>
          <FullName name={this.props.applicationData.fullName}
            onUserInput={(update) => {this.props.onStateChange('fullName', update);} } />
          <MothersMaidenName name={this.props.applicationData.mothersMaidenName}
            onUserInput={(update) => {this.props.onStateChange('mothersMaidenName', update);} } />
        </div>
      </div>
    )
  }
}

class Night extends React.Component {
  render() {
    return (
      <div>
        <h2>Goodnight World</h2>
      </div>
    )
  }
}

export { Hello, Nav, Night };
