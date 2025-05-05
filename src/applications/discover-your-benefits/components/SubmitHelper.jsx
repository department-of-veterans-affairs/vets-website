import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getResults } from '../reducers/actions';

const SubmitHelper = props => {
  const handleClick = () => {
    props.getResults(props.form.data);
  };
  return (
    <div
      id="submit-helper"
      aria-hidden="true"
      onClick={handleClick}
      onKeyDown={() => {}}
    />
  );
};

SubmitHelper.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.object,
  }),
  getResults: PropTypes.func,
};

const mapDispatchToProps = {
  getResults,
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SubmitHelper);
