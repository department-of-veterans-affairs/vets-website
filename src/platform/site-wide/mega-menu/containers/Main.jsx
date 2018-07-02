import React from 'react';
import { connect } from 'react-redux';
import data from '../data.json';

import MainDropDown from '../components/MainDropDown';

// const SESSION_REFRESH_INTERVAL_MINUTES = 45;

export class Main extends React.Component {
  constructor() {
    super();

    this.updateCurrentSection = this.updateCurrentSection.bind(this);
  }

  updateCurrentSection(currentSection) {
    this.setState({ currentSection });
  }

  render() {
    return (
      <div className="login-container">
        <div className="row va-flex">
          <div id="vetnav" role="navigation">
            <ul id="vetnav-menu" role="menubar">
              <li><a href="/" className="vetnav-level1" role="menuitem">Home</a></li>
              {
                data.map((item, i) => (
                  <MainDropDown
                    {...this.props}
                    key={`${i}-main-dropdown`}
                    title={item.title}
                    data={item}>
                  </MainDropDown>
                ))
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ megaMenu }) => ({ ...megaMenu });

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
