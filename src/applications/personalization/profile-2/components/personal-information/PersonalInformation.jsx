import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router-dom';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';

import PersonalInformationContent from './PersonalInformationContent';

const PersonalInformation = ({ hasUnsavedEdits }) => {
  useEffect(() => {
    focusElement('[data-focus-target]');
  }, []);

  useEffect(
    () => {
      // Show alert when navigating away
      if (hasUnsavedEdits) {
        window.onbeforeunload = () => true;
        return;
      }

      window.onbeforeunload = undefined;
    },
    [hasUnsavedEdits],
  );

  return (
    <>
      <Prompt
        message="Are you sure you want to leave? If you leave, your in-progress work won't be saved."
        when={hasUnsavedEdits}
      />
      <h2
        tabIndex="-1"
        className="vads-u-margin-y--2 medium-screen:vads-u-margin-bottom--4 medium-screen:vads-u-margin-top--3"
        data-focus-target
      >
        Personal and contact information
      </h2>
      <PersonalInformationContent />
    </>
  );
};

PersonalInformation.propTypes = {
  hasUnsavedEdits: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  hasUnsavedEdits: state.vet360.hasUnsavedEdits,
});

export default connect(
  mapStateToProps,
  null,
)(PersonalInformation);
