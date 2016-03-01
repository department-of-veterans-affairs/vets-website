import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router, hashHistory } from 'react-router';

import FinancialAssessmentPanel from './components/FinancialAssessmentPanel.jsx';
import HealthCareApp from './components/HealthCareApp.jsx';
import IntroductionPanel from './components/IntroductionPanel.jsx';
import InsuranceInformationPanel from './components/InsuranceInformationPanel.jsx';
import MilitaryServicePanel from './components/MilitaryServicePanel.jsx';
import PersonalInformationPanel from './components/PersonalInformationPanel.jsx';
import ReviewAndSubmitPanel from './components/ReviewAndSubmitPanel.jsx';

function init() {
  ReactDOM.render((
    <Router history={hashHistory}>
      <Route path="/" component={HealthCareApp}>
        <Route path="/introduction" component={IntroductionPanel}/>
        <Route path="/personal-information" component={PersonalInformationPanel}/>
        <Route path="/insurance-information" component={InsuranceInformationPanel}/>
        <Route path="/military-service" component={MilitaryServicePanel}/>
        <Route path="/financial-assessment" component={FinancialAssessmentPanel}/>
        <Route path="/review-and-submit" component={ReviewAndSubmitPanel}/>
      </Route>
    </Router>
    ), document.getElementById('react-root'));
}

export { init };
