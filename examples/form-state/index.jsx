import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link } from 'react-router-dom';
import {
  TextField,
  DebuggerView,
  Router,
  Page
} from '@department-of-veterans-affairs/va-forms-system-core';

import '@department-of-veterans-affairs/component-library/dist/main.css';
import { defineCustomElements } from '@department-of-veterans-affairs/component-library';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
void defineCustomElements();

export const ContextApp = () => {

  return (
    <Router basename="form-data">
      <Page title="Example form" path="/one">
        <TextField name="formData.foo" label="Foo Example Field" required />
        <TextField name="formData.bar" label="Bar Example Field" required />

        <button type="submit">
          Push My Button
        </button>
        <Link to="/two"> Page two </Link>
        <DebuggerView />
      </Page>
      <Page title="Example form" path="/two">
        <TextField name="formData.fiz" label="Fiz Example Field" required />
        <TextField name="formData.buz" label="Buz Example Field" required />

        <button type="submit">
          Push My Button
        </button>
        <Link to="/one">Page one</Link>
        <DebuggerView />
      </Page>
      
      {/* This Route is last because a Switch will render whichever component */}
      {/* is the first to match a path, and a `/` would be a match for any page */}
      {/* https://reactrouter.com/web/guides/quick-start */}
      <Route path="/">
        <div className="vads-u-display--flex vads-u-align-items--center vads-u-flex-direction--column">
          <Link to="/one">
            <h1>State Form App Page!</h1>
          </Link>
        </div>
      </Route>
    </Router>
  );
};

ReactDOM.render(<ContextApp />, document.getElementById('root'));
