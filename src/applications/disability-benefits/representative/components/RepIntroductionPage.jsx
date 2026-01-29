import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

/**
 * RepIntroductionPage - Introduction page for the representative-facing 526EZ form
 *
 * This introduction page is specifically for accredited representatives filing
 * disability compensation claims on behalf of veterans.
 */
class RepIntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const { route } = this.props;
    const { formConfig, pageList } = route;

    return (
      <article className="schemaform-intro">
        <FormTitle
          title="File a disability compensation claim for a veteran"
          subTitle="VA Form 21-526EZ (Representative)"
        />

        <p>
          As an accredited representative, you can use this form to file a
          disability compensation claim on behalf of a veteran you represent.
        </p>

        <h2 className="vads-u-font-size--h3">
          Follow the steps below to file a claim
        </h2>

        <va-process-list>
          <va-process-list-item header="Gather the veteran's information">
            <p>You'll need the veteran's:</p>
            <ul>
              <li>Full legal name</li>
              <li>Social Security number</li>
              <li>Date of birth</li>
              <li>Contact information</li>
            </ul>
          </va-process-list-item>
          <va-process-list-item header="Identify conditions to claim">
            <p>
              List the conditions the veteran wants to claim for disability
              compensation.
            </p>
          </va-process-list-item>
          <va-process-list-item header="Gather supporting evidence">
            <p>
              Identify any VA medical records, private medical records, or other
              supporting documents.
            </p>
          </va-process-list-item>
          <va-process-list-item header="Submit the claim">
            <p>
              Review the information and submit the claim on behalf of the
              veteran.
            </p>
          </va-process-list-item>
        </va-process-list>

        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the disability compensation claim"
        />

        <va-omb-info
          res-burden={25}
          omb-number="2900-0747"
          exp-date="03/31/2027"
        />
      </article>
    );
  }
}

RepIntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.object,
    }),
    pageList: PropTypes.array,
  }),
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(RepIntroductionPage);
