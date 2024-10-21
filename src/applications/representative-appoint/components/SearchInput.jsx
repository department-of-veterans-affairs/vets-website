import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from '~/platform/forms-system/src/js/actions';

const SearchInput = ({ formData, setFormData, error, onSubmit }) => {
  const handleInputChange = e => {
    setFormData({
      ...formData,
      'view:representativeQuery': e.target.value,
    });
  };

  return (
    <div className="vads-u-display--flex vads-u-margin-bottom--3">
      <div className="vads-u-margin-right--2 vads-u-flex--1">
        <va-text-input
          id="representative_search"
          name="representative_search"
          error={error}
          value={formData['view:representativeQuery']}
          onInput={handleInputChange}
          required
        />
      </div>
      <div
        className={`vads-u-margin-top--${
          error ? '8' : '1'
        } vads-u-margin-bottom--1`}
      >
        <VaButton text="Search" onClick={onSubmit} />
      </div>
    </div>
  );
};

SearchInput.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  error: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchInput);
