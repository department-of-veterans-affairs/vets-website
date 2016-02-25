import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router, hashHistory } from 'react-router';

import FinancialAssessmentPanel from './_components/financial-assessment-panel.jsx';
import HealthCareApp from './_components/health-care-app.jsx';
import IntroductionPanel from './_components/introduction-panel.jsx';
import InsuranceInformationPanel from './_components/insurance-information-panel.jsx';
import MilitaryServicePanel from './_components/military-service-panel.jsx';
import PersonalInformationPanel from './_components/personal-information-panel.jsx';
import ReviewAndSubmitPanel from './_components/review-and-submit-panel.jsx';

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
