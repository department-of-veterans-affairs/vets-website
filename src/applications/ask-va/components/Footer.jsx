import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import NeedHelpFooter from './NeedHelpFooter';
import NeedHelpFooterEducation from './NeedHelpFooterEducation';

const catIDs = {
  EDUCATION_BENEFITS: '75524deb-d864-eb11-bb24-000d3a579c45',
  BENEFITS_ISSUES: '66524deb-d864-eb11-bb24-000d3a579c45',
};

const topicIDs = {
  VETERAN_READINESS: 'STILL-NEED-ID-FROM-CRM',
  EDUCATION_BENEFITS: 'bf2a8586-e764-eb11-bb23-000d3a579c3f',
};

const catAndTopicPaths = ['/category-topic-1', '/category-topic-2'];

const getFooter = (cat, topic) => {
  if (
    (cat === catIDs.EDUCATION_BENEFITS &&
      topic !== topicIDs.VETERAN_READINESS) ||
    (cat === catIDs.BENEFITS_ISSUES && topic === topicIDs.EDUCATION_BENEFITS)
  ) {
    return <NeedHelpFooterEducation />;
  }

  return <NeedHelpFooter />;
};

const Footer = ({ currentLocation, categoryID, topicID }) => {
  const { pathname } = currentLocation;

  return (
    <>
      <div className="vads-u-margin-bottom--2">
        <div className="row">
          <div className="usa-width-two-thirds medium-8 columns">
            {!catAndTopicPaths.includes(pathname) ? (
              getFooter(categoryID, topicID)
            ) : (
              <NeedHelpFooter />
            )}
          </div>
        </div>
        <div className="row">
          <va-back-to-top />
        </div>
      </div>
    </>
  );
};

Footer.propTypes = {
  categoryID: PropTypes.string,
  currentLocation: PropTypes.object,
  topicID: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    categoryID: state.askVA.categoryID,
    topicID: state.askVA.topicID,
  };
}

export default connect(mapStateToProps)(Footer);
