import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ELIGIBILITY } from '../actions';

function BenefitRelinquishedLabel({ eligibility }) {
  if (!eligibility) {
    return <></>;
  }

  const chapter30Eligible = eligibility.includes(ELIGIBILITY.CHAPTER30);
  const chapter1606Eligible = eligibility.includes(ELIGIBILITY.CHAPTER1606);

  const additionalInfoText1 = [
    'Our records show you may be eligible for',
    chapter30Eligible && chapter1606Eligible ? 'both' : 'the',
    chapter30Eligible ? 'Montgomery GI Bill Active Duty (Chapter 30)' : '',
    chapter30Eligible && chapter1606Eligible ? 'and' : '',
    chapter1606Eligible
      ? 'Montgomery GI Bill Selected Reserve (Chapter 1606)'
      : '',
  ]
    .join(' ')
    .trim();

  const additionalInfoText2 = [
    'If you give up',
    chapter30Eligible && chapter1606Eligible
      ? 'one of these benefits,'
      : 'this benefit,',
    'we’ll pay you for any eligible kickers associated with it.',
  ].join(' ');

  return (
    <>
      <span className="meb-labels_label--main">
        Which benefit will you give up?
      </span>
      <va-additional-info
        trigger="More information on choices"
        class="meb-labels_label--secondary vads-u-margin-top--2"
      >
        <p className="vads-u-margin-top--0">{additionalInfoText1}.</p>
        <p className="vads-u-margin-bottom--0">{additionalInfoText2}</p>
      </va-additional-info>
    </>
  );
}

BenefitRelinquishedLabel.propTypes = {
  eligibility: PropTypes.arrayOf(PropTypes.string),
};

const mapStateToProps = state => ({
  eligibility: state.form?.data?.eligibility,
});

export default connect(mapStateToProps)(BenefitRelinquishedLabel);
