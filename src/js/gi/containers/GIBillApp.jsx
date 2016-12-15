import React from 'react';
import LandingPage from './LandingPage';
import SearchPage from './SearchPage';
import ProfilePage from './ProfilePage';
import AboutThisTool from '../components/AboutThisTool';

class GIBillApp extends React.Component {

  renderPage(page) {
    const pages = {
      search: (<SearchPage queryParams={this.props.location.query}/>),
      profile: (<ProfilePage queryParams={this.props.location.query}/>)
    };
    return pages[page] ||
      (<LandingPage queryParams={this.props.location.query}/>);
  }

  render() {
    return (
      <span id="gi-bill-app">
        {this.renderPage(this.props.params.page)}
        <div className="row">
          <AboutThisTool/>
        </div>
      </span>
    );
  }

}

GIBillApp.defaultProps = {};

export default GIBillApp;
