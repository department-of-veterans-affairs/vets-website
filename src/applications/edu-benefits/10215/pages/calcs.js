import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Calcs = ({ data }) => {
  const programIdx = window.location.href.split('?')[0].slice(-1);
  const program = data.programs?.[programIdx];
  const supported = Number(program?.fte?.supported);
  const nonSupported = Number(program?.fte?.nonSupported);
  const total = supported + nonSupported;

  return (
    <>
      <div className="vads-u-margin-bottom--1">
        <label className="vads-u-margin-bottom--1">Total Enrolled FTE</label>
        <span className="vads-u-font-size--h3 vads-u-font-weight--bold">{supported && nonSupported ? total : '--'}</span>
      </div>
      <va-additional-info trigger="How is Total enrolled FTE calculated?">
        <p>
          Number of supported students FTE plus number of non-supported students
          FTE.
        </p>
        <p>
          If this number seems inaccurate, please check the numbers you entered
          above.
        </p>
      </va-additional-info>
      <div className="vads-u-margin-bottom--1">
        <label className="vads-u-margin-bottom--1">
          Supported student percentage FTE
        </label>
        <span className="vads-u-font-size--h3 vads-u-font-weight--bold">
          {supported && nonSupported ? `${((supported / total) * 100).toFixed(2).replace(/[.,]00$/, "")}%` : '--%'}
        </span>
      </div>
      <va-additional-info trigger="How is Supported student percentage FTE calculated?">
        <p>
          (Number of supported students FTE divided by Total enrollment FTE)
          multiplied by 100 + Supported student percentage FTE.
        </p>
        <p>
          If this number seems incorrect, please check the numbers you entered
          above.
        </p>
      </va-additional-info>
    </>
  );
};

Calcs.propTypes = {
  data: PropTypes.object,
};

const mapStateToProps = state => ({
  data: state.form.data,
});

export default connect(mapStateToProps)(Calcs);
