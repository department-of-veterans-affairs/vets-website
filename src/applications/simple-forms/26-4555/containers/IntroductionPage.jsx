import React from 'react';

import PropTypes from 'prop-types';

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
          title="Apply for an adapted housing grant"
          subTitle="Application in Acquiring Specially Adapted Housing or Special Home Adaptation Grant (VA Form 26-4555)"
        />
        <h2>Here&rsquo;s how to apply online</h2>
        <p>
          Complete this form. After you submit the form, you&rsquo;ll get a
          confirmation message. You can print this page for your records.
        </p>
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the housing grant application"
          testActionLink
        >
          Please complete the 26-4555 form to apply for adapted housing.
        </SaveInProgressIntro>
        <p />
        <va-omb-info
          res-burden="10"
          omb-number="2900-0132"
          exp-date="6/20/2024"
        />
      </article>
    );
  }
}

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      savedFormMessages: PropTypes.shape({}),
    }),
    pageList: PropTypes.array,
  }),
};

export default IntroductionPage;
