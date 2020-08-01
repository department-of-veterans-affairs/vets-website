import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
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

const loading = (
  <div className="vads-u-margin--3">
    <LoadingIndicator message={message} />
  </div>
);

export const AddPerson = props => {
  switch (props?.mvi?.addPersonState) {
    case MVI_ADD_NOT_ATTEMPTED:
      props.addPerson();
      return null;
    case MVI_ADD_INITIATED:
      return loading;
    case MVI_ADD_FAILED:
      return <MissingServices />;
    case MVI_ADD_SUCCEEDED:
      // remove 'add-person' user.profile.services here?
      return null;
    default:
      return null;
  }
};

AddPerson.propTypes = {
  addPerson: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  addPerson: addPersonAction,
};

export default connect(
  state => state,
  mapDispatchToProps,
)(AddPerson);
