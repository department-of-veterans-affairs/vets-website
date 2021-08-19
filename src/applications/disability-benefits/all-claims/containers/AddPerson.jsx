import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { MissingServices } from './MissingServices';

import {
  addPerson as addPersonAction,
  MVI_ADD_NOT_ATTEMPTED,
  MVI_ADD_INITIATED,
  MVI_ADD_SUCCEEDED,
  MVI_ADD_FAILED,
} from '../actions';

const message =
  'We’re doing some additional work to enable you to file a claim...';

const loading = title => (
  <div className="vads-l-grid-container vads-u-padding-left--0 vads-u-padding-bottom--5">
    <div className="usa-content">
      <h1>{title}</h1>
      <LoadingIndicator message={message} />
    </div>
  </div>
);

export const AddPerson = props => {
  switch (props?.mvi?.addPersonState) {
    case MVI_ADD_NOT_ATTEMPTED:
      props.addPerson();
      return null;
    case MVI_ADD_INITIATED:
      return loading(props.title);
    case MVI_ADD_FAILED:
      return <MissingServices title={props.title} />;
    case MVI_ADD_SUCCEEDED:
      // remove 'add-person' user.profile.services here?
      return null;
    default:
      return null;
  }
};

AddPerson.propTypes = {
  addPerson: PropTypes.func.isRequired,
  title: PropTypes.string,
};

const mapDispatchToProps = {
  addPerson: addPersonAction,
};

export default connect(
  state => state,
  mapDispatchToProps,
)(AddPerson);
