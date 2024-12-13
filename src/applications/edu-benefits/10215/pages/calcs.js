import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFTECalcs } from '../helpers';

const Calcs = ({ data }) => {
  const programIdx = window.location.href.split('?')[0].slice(-1);
  const program = data.programs?.[programIdx];
  const { supported, nonSupported, total, supportedFTEPercent } = getFTECalcs(
    program,
  );

  return (
    <>
      <div className="vads-u-margin-bottom--1">
        <label className="vads-u-margin-bottom--1">Total Enrolled FTE</label>
        <span className="vads-u-font-size--h3 vads-u-font-weight--bold">
          {supported || nonSupported ? total : '--'}
        </span>
      </div>
      <va-additional-info trigger="How is Total enrolled FTE calculated?">
        <p>
          Number of supported students FTE plus number of non-supported students
          FTE.
        </p>
        <br />
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
          {supportedFTEPercent || '--%'}
        </span>
      </div>
      <va-additional-info trigger="How is Supported student percentage FTE calculated?">
        <p>
          (Number of supported students FTE divided by Total enrollment FTE)
          multiplied by 100 = Supported student percentage FTE.
        </p>
        <br />
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
