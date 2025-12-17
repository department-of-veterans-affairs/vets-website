import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import ViewDependentsListItem from './ViewDependentsListItemV2';

const RemoveDependentSuccessMessage = () => (
  <p
    aria-live="polite"
    className="vads-u-background-color--green-lightest vads-u-padding--2"
  >
    We’ll update your information for this dependent. If we need you to give us
    more information or documents, we’ll contact you by mail.
  </p>
);

/**
 * @typedef ViewDependentsListProps
 * @property {String} header
 * @property {Boolean} isAward
 * @property {Boolean} loading
 * @property {Boolean} manageDependentsToggle
 * @property {Boolean} showPersonalInformationNote
 * @property {Object} subHeader
 * @property {Array} submittedDependents
 */
/**
 * View Dependents list
 * List of dependent cards
 * @param {ViewDependentsListProps} props - Component props
 * @returns {JSX.Element} Dependent cards
 */
function ViewDependentsList(props) {
  let mainContent;
  let showPersonalInformationNote = false;
  const manageDependentsToggle = props?.manageDependentsToggle ?? null;
  if (props.loading) {
    mainContent = (
      <va-loading-indicator message="Loading your dependents" set-focus />
    );
  } else if (props.dependents && props.dependents.length > 0) {
    mainContent = props.dependents.map((dependent, index) => (
      <ViewDependentsListItem
        key={index}
        stateKey={index}
        manageDependentsToggle={manageDependentsToggle}
        {...dependent}
      />
    ));
    showPersonalInformationNote = props.showPersonalInformationNote;
  } else {
    mainContent = (
      <va-alert status="info" slim>
        {props?.isAward
          ? 'You have no dependents on your VA benefits.'
          : `We have no record of dependents who are not on your VA benefits.`}
      </va-alert>
    );
  }

  return (
    <>
      <h2 className="view-deps-header">{props.header}</h2>
      <p>{props.subHeader}</p>
      {manageDependentsToggle &&
        props?.submittedDependents?.length > 0 && (
          <RemoveDependentSuccessMessage />
        )}
      {mainContent}
      {showPersonalInformationNote && (
        <div className="vads-u-margin-bottom--4" data-testid="default-note">
          <p>
            <strong>Note:</strong> To protect your personal information, we
            don’t allow online changes to your dependents’ names, dates of
            birth, or Social Security numbers. If you need to change this
            information, call us at{' '}
            <va-telephone contact={CONTACTS.VA_BENEFITS} />(
            <va-telephone contact="711" tty />
            ). We’re here Monday through Friday, between 8:00 a.m. and 9:00 p.m.
            ET.
          </p>
          <va-link
            external
            href="/resources/how-to-change-your-legal-name-on-file-with-va/"
            text="Find more detailed instructions for how to change your dependents’ names"
          />
        </div>
      )}
    </>
  );
}

const mapStateToProps = state => ({
  submittedDependents: state?.removeDependents?.submittedDependents,
});

export default connect(
  mapStateToProps,
  null,
)(ViewDependentsList);

export { ViewDependentsList };
ViewDependentsList.propTypes = {
  dependents: PropTypes.array,
  header: PropTypes.string,
  isAward: PropTypes.bool,
  loading: PropTypes.bool,
  manageDependentsToggle: PropTypes.bool,
  showPersonalInformationNote: PropTypes.bool,
  subHeader: PropTypes.object,
  submittedDependents: PropTypes.array,
};
