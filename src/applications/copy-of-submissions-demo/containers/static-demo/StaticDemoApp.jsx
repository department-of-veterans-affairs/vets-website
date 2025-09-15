import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from 'react-router-dom';
import IntroductionPage from './IntroductionPage';
import ReviewPage from './ReviewPage';
import ConfirmationPage from './ConfirmationPage';

const HeaderPlaceholder = () => (
  <div
    data-widget-type="header"
    data-show="true"
    data-show-mega-menu="true"
    data-show-nav-login="true"
  />
);

const FooterPlaceholder = () => <div id="footerNav" />;

const allowedSteps = ['introduction', 'review', 'confirmation'];

function getBasePath() {
  const { pathname } = window.location;
  return pathname.replace(/\/(introduction|review|confirmation)\/?$/, '');
}

function DemoRoutes({ basePath }) {
  const history = useHistory();

  const goTo = step => () => {
    const newStep = allowedSteps.includes(step) ? step : 'introduction';
    const path = `${basePath}/${newStep}`;
    history.push(path);
  };

  return (
    <Switch>
      <Route exact path={basePath}>
        <Redirect to={`${basePath}/introduction`} />
      </Route>

      <Route
        path={`${basePath}/introduction`}
        render={() => <IntroductionPage onNext={goTo('review')} />}
      />

      <Route
        path={`${basePath}/review`}
        render={() => <ReviewPage onNext={goTo('confirmation')} />}
      />

      <Route path={`${basePath}/confirmation`} component={ConfirmationPage} />

      {/* Fallback to introduction if nothing matches */}
      <Redirect to={`${basePath}/introduction`} />
    </Switch>
  );
}

DemoRoutes.propTypes = {
  basePath: PropTypes.string.isRequired,
};

export default function StaticDemoApp() {
  const basePath = getBasePath();

  return (
    <div>
      <HeaderPlaceholder />
      <div className="vads-u-padding-top--2">
        <Router>
          <DemoRoutes basePath={basePath} />
        </Router>
      </div>
      <FooterPlaceholder />
    </div>
  );
}
