import React from 'react';
import ReactDOM from 'react-dom';

import {
  CheckboxField,
  DebuggerView,
  Page,
  Router,
  TextField,
} from '@department-of-veterans-affairs/va-forms-system-core';

import { Link, Switch } from 'react-router-dom';

import '@department-of-veterans-affairs/component-library/dist/main.css';
import { defineCustomElements } from '@department-of-veterans-affairs/component-library';
import Chapter from '@department-of-veterans-affairs/va-forms-system-core/routing/Chapter';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
void defineCustomElements();

const App = () => (
  <Router basename="multipage-form">
    <>
      <div className="vads-u-display--flex vads-u-align-items--center vads-u-flex-direction--column">
        <Link to="/intro-page">Intro Page</Link>
      </div>

      <Switch>
        <Page title="Intro Page" path="/intro-page">
          <div>
            This Intro &lt;Page/&gt; component does not use a &lt;Chapter/&gt;
            component.
          </div>
          <div>
            The next few links will take you through &lt;Chapter/&gt; and
            &lt;Page/&gt; components.
          </div>
          <Link to="/chapter-one/page-one">Chapter 1 - Page 1</Link>
        </Page>

        <Chapter title="Chapter One" path="/chapter-one">
          <Page title="Page One" path="/page-one">
            <TextField name="foo" label="Example" required />
            <DebuggerView />
            <Link to="/chapter-one/page-two">Chapter 1 - Page 2</Link>
          </Page>

          <Page title="Page Two" path="/page-two">
            <CheckboxField name="bar" label="Do you have pets?" required />
            <DebuggerView />
            <Link to="/chapter-two/page-one">Chapter 2 - Page 1</Link>
          </Page>
        </Chapter>

        <Chapter title="Chapter Two" path="/chapter-two">
          <Page title="Page One" path="/page-one">
            <div>Page 1</div>
            <Link to="/chapter-two/page-two">Chapter 2 - Page 2</Link>
          </Page>

          <Page title="Page Two" path="/page-two">
            <div>Page 2</div>
            <div>done</div>
            <Link to="/chapter-one/page-one">Chapter 1 - Page 1</Link>
          </Page>
        </Chapter>
      </Switch>
    </>
  </Router>
);

ReactDOM.render(<App />, document.getElementById('root'));
