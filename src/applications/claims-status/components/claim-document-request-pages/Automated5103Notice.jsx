import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom-v5-compat';
import {
  VaCheckbox,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { buildDateFormatter } from '../../utils/helpers';
import {
  // START ligthouse_migration
  submit5103 as submit5103Action,
  submitRequest as submitRequestAction,
  // END lighthouse_migration
} from '../../actions';
// START lighthouse_migration
import { cstUseLighthouse } from '../../selectors';
// END lighthouse_migration
import { setUpPage } from '../../utils/page';

import withRouter from '../../utils/withRouter';

function Automated5103Notice({
  item,
  navigate,
  params,
  submit5103,
  submitRequest,
  useLighthouse5103,
}) {
  const [addedEvidence, setAddedEvidence] = useState(false);
  const [checkboxErrorMessage, setCheckboxErrorMessage] = useState(undefined);

  useEffect(() => {
    setUpPage();
  }, []);

  const goToFilesPage = () => {
    navigate('../files');
  };

  const submit = () => {
    if (addedEvidence) {
      if (useLighthouse5103) {
        submit5103(params.id, true);
      } else {
        submitRequest(params.id, true);
      }
      goToFilesPage();
    } else {
      setCheckboxErrorMessage(
        `You must confirm you’re done adding evidence before submitting the evidence waiver`,
      );
    }
  };
  const formattedDueDate = buildDateFormatter()(item.suspenseDate);
  if (item.displayName !== 'Automated 5103 Notice Response') {
    return null;
  }
  return (
    <div id="automated-5103-notice-page">
      <h1 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
        5103 Evidence Notice
      </h1>
      <p>
        We sent you a “5103 notice” letter that lists the types of evidence we
        may need to decide your claim.
      </p>
      <Link className="active-va-link" to="/your-claim-letters">
        Go to claim letters
        <va-icon icon="chevron_right" size={3} aria-hidden="true" />
      </Link>
      <p>
        You don’t need to do anything on this page. We’ll wait until{' '}
        <strong>{formattedDueDate}</strong>, to move your claim to the next
        step.
      </p>
      <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--2">
        If you have more evidence to submit
      </h2>
      <p>
        <strong>Note:</strong> You can add evidence at any time. But if you add
        evidence later in the process, your claim will move back to this step.
        So we encourage you to add all your evidence now.
      </p>
      <Link data-testid="upload-evidence-link" to="../files">
        Upload your evidence here
      </Link>
      <p>
        If you finish adding evidence before that date,{' '}
        <strong>
          you can submit the 5103 notice response waiver attached to the letter.
        </strong>{' '}
        This might help speed up the claim process.
      </p>
      <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--2">
        If you don’t have more evidence to submit
      </h2>
      <p>
        If you’re finished adding evidence, submit the evidence waiver. We’ll
        move your claim to the next step as soon as possible.
      </p>
      <VaCheckbox
        label="I’m finished adding evidence to support my claim."
        className="vads-u-margin-y--3"
        checked={addedEvidence}
        error={checkboxErrorMessage}
        onVaChange={event => {
          setAddedEvidence(event.detail.checked);
        }}
      />
      <VaButton id="submit" text="Submit evidence waiver" onClick={submit} />
    </div>
  );
}
// }

function mapStateToProps(state) {
  return {
    // START lighthouse_migration
    useLighthouse5103: cstUseLighthouse(state, '5103'),
    // END lighthouse_migration
  };
}

const mapDispatchToProps = {
  // START lighthouse_migration
  submit5103: submit5103Action,
  submitRequest: submitRequestAction,
  // END lighthouse_migration
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Automated5103Notice),
);

Automated5103Notice.propTypes = {
  item: PropTypes.object,
  navigate: PropTypes.func,
  params: PropTypes.object,
  // START lighthouse_migration
  submit5103: PropTypes.func,
  submitRequest: PropTypes.func,
  useLighthouse5103: PropTypes.bool,
  // END lighthouse_migration
};

export { Automated5103Notice };
