import React from 'react';
import _ from 'lodash';

import IntroductionSection from './IntroductionSection.jsx';
import Nav from './Nav.jsx';
import PopulateVeteranButton from './debug/PopulateVeteranButton';
import PerfPanel from './debug/PerfPanel';
import ProgressButton from './ProgressButton';
import RoutesDropdown from './debug/RoutesDropdown';
import { ensureFieldsInitialized } from '../actions';
import { pathToData } from '../store';

import * as validations from '../utils/validations';

class HealthCareApp extends React.Component {
  constructor(props) {
    super(props);
    this.handleBack = this.handleBack.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getUrl = this.getUrl.bind(this);
  }

  getUrl(direction) {
    const routes = this.props.route.childRoutes;
    const panels = [];
    let currentPath = this.props.location.pathname;
    let nextPath = '';

    // TODO(awong): remove the '/' alias for '/introduction' using history.replaceState()
    if (currentPath === '/') {
      currentPath = '/introduction';
    }

    panels.push.apply(panels, routes.map((obj) => { return obj.path; }));

    for (let i = 0; i < panels.length; i++) {
      if (currentPath === panels[i]) {
        if (direction === 'back') {
          nextPath = panels[i - 1];
        } else {
          nextPath = panels[i + 1];
        }
        break;
      }
    }

    return nextPath;
  }

  handleContinue() {
    const path = this.props.location.pathname;
    const sectionData = pathToData(this.context.store.getState(), path);

    this.context.store.dispatch(ensureFieldsInitialized(path));
    if (validations.isValidSection(path, sectionData)) {
      this.context.router.push(this.getUrl('next'));
      if (document.getElementsByClassName('progress-box').length > 0) {
        document.getElementsByClassName('progress-box')[0].scrollIntoView();
      }
    } else {
      // TODO: improve this
      if (document.getElementsByClassName('usa-input-error').length > 0) {
        document.getElementsByClassName('usa-input-error')[0].scrollIntoView();
      }
    }
  }

  handleBack() {
    this.context.router.push(this.getUrl('back'));
    if (document.getElementsByClassName('progress-box').length > 0) {
      document.getElementsByClassName('progress-box')[0].scrollIntoView();
    }
  }

  handleSubmit() {
    // Add functionality
  }

  render() {
    let children = this.props.children;
    let buttons;

    if (children === null) {
      // This occurs if the root route is hit. Default to IntroductionSection.
      children = <IntroductionSection/>;
    }

    // Check which section the user is on and render the correct ProgressButtons.
    const lastSectionText = (this.getUrl('back')) ? this.getUrl('back').split('/').slice(-1)[0].replace(/-/g, ' ') : '';
    const nextSectionText = (this.getUrl('next')) ? this.getUrl('next').split('/').slice(-1)[0].replace(/-/g, ' ') : '';

    const backButton = (
      <ProgressButton
          onButtonClick={this.handleBack}
          buttonText={`Back to ${lastSectionText}`}
          buttonClass={'usa-button-outline'}
          beforeText={'«'}/>
    );

    const nextButton = (
      <ProgressButton
          onButtonClick={this.handleContinue}
          buttonText={`Continue to ${nextSectionText}`}
          buttonClass={'usa-button-primary'}
          afterText={'»'}/>
    );

    const submitButton = (
      <ProgressButton
          onButtonClick={this.handleSubmit}
          buttonText={'Submit'}
          buttonClass={'usa-button-primary'}/>
    );

    if (this.props.location.pathname === '/review-and-submit') {
      buttons = (
        <div>
          {submitButton}
          {backButton}
        </div>
      );
    } else if (this.props.location.pathname === '/introduction') {
      buttons = (
        <div>
          {nextButton}
        </div>
      );
    } else {
      buttons = (
        <div>
          {nextButton}
          {backButton}
        </div>
      );
    }
    let devPanel = undefined;
    // TODO(awong): Wrap to disable on production sites.
    const queryParams = _.fromPairs(
      window.location.search.substring(1).split('&').map((v) => { return v.split('='); }));
    if (queryParams.devPanel === '1') {
      devPanel = (
        <div className="row">
          <RoutesDropdown/>
          <PopulateVeteranButton/>
          <PerfPanel/>
        </div>
      );
    }

    return (
      <div className="row">
        <div className="medium-4 columns show-for-medium-up">
          <Nav currentUrl={this.props.location.pathname}/>
        </div>
        <div className="medium-8 columns">
          {devPanel}
          <div className="progress-box">
            <div className="form-panel">
              {children}
              {buttons}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// TODO(awong): Hack to allow access to the store for now while migrating.
// All uses of this.context.store in this file are WRONG!!!
HealthCareApp.contextTypes = {
  router: React.PropTypes.object.isRequired,
  store: React.PropTypes.object
};

export default HealthCareApp;
