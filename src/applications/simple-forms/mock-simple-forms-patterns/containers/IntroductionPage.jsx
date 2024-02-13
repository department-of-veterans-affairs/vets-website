import React from 'react';
import { Link } from 'react-router';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const { route } = this.props;
    const { formConfig, pageList } = route;

    return (
      <article className="schemaform-intro">
        <FormTitle
          title="Apply for Simple Forms Patterns"
          subTitle="Application in Simple Forms Patterns"
        />
        <h2>Here&rsquo;s how to apply online</h2>
        <p>
          Complete this form. After you submit the form, you&rsquo;ll get a
          confirmation message. You can print this page for your records.
        </p>
        <div>
          <h3>Pages</h3>
          <ul>
            <li>
              <Link to="/chapter-select">Chapter select</Link>
            </li>
            <li>
              <Link to="/text-input">Text input</Link>
            </li>
            <li>
              <Link to="/text-input-widgets1">Text input widgets 1</Link>
            </li>
            <li>
              <Link to="/text-input-full-name">Text input full name</Link>
            </li>
            <li>
              <Link to="/text-input-address">Text input address</Link>
            </li>
            <li>
              <Link to="/forms-pattern-single-radio">
                Forms pattern - single - radio
              </Link>
            </li>
            <li>
              <Link to="/forms-pattern-single-checkbox-group">
                Forms pattern - single - checkbox group
              </Link>
            </li>
            <li>
              <Link to="/forms-pattern-multiple">
                Forms pattern - multiple - text
              </Link>
            </li>
            <li>
              <Link to="/number-input">Number input</Link>
            </li>
            <li>
              <Link to="/ssn-pattern">Ssn pattern</Link>
            </li>
            <li>
              <Link to="/checkbox-and-text-input">Checkbox and text input</Link>
            </li>
            <li>
              <Link to="/checkbox-group">Checkbox group</Link>
            </li>
            <li>
              <Link to="/select">Select</Link>
            </li>
            <li>
              <Link to="/radio">Radio</Link>
            </li>
            <li>
              <Link to="/radio-relationship-to-veteran">
                Radio relationship to veteran
              </Link>
            </li>
            <li>
              <Link to="/date">Date</Link>
            </li>
            <li>
              <Link to="/dynamic-fields">Dynamic fields</Link>
            </li>
            <li>
              <Link to="/array-single-page">Array - single page</Link>
            </li>
            <li>
              <Link to="/array-multiple-page-aggregate">
                Array - multiple page - aggregate pattern
              </Link>
            </li>
            <li>
              <Link to="/array-multiple-page-builder-summary">
                Array - multiple page - builder pattern
              </Link>
            </li>
          </ul>
        </div>
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the housing grant application"
        >
          Please complete the Simple Forms Patterns form to apply for Simple
          Forms Patterns.
        </SaveInProgressIntro>
        <p />
        <va-omb-info
          res-burden="10"
          omb-number="SIMPLE_FORMS_PATTERNS"
          exp-date="6/20/2024"
        />
      </article>
    );
  }
}

export default IntroductionPage;
