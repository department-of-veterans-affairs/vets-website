import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import { focusElement } from '~/platform/utilities/ui';

import {
  fetchMilitaryInformation as fetchMilitaryInformationAction,
  fetchHero as fetchHeroAction,
  fetchPersonalInformation as fetchPersonalInformationAction,
} from '@@profile/actions';

import { fetchTotalDisabilityRating as fetchTotalDisabilityRatingAction } from '~/applications/personalization/rated-disabilities/actions';

import NameTag from '~/applications/personalization/profile/components/NameTag';

import ApplyForBenefits from './apply-for-benefits/ApplyForBenefits';
import ClaimsAndAppeals from './claims-and-appeals/ClaimsAndAppeals';
import HealthCare from './health-care/HealthCare';

const Dashboard = props => {
  useEffect(() => {
    props.fetchFullName();
    props.fetchPersonalInformation();
    props.fetchMilitaryInformation();
    props.fetchTotalDisabilityRating();
    focusElement('#dashboard-title');
  }, []);

  return (
    <>
      {isEmpty(props.hero?.errors) && (
        <NameTag
          showUpdatedNameTag
          totalDisabilityRating={props.totalDisabilityRating}
        />
      )}
      <div className="vads-l-grid-container vads-u-padding-x--0">
        <Breadcrumbs>
          <a href="/" key="home">
            Home
          </a>
          <span className="vads-u-color--black" key="dashboard">
            <strong>My VA</strong>
          </span>
        </Breadcrumbs>

        <h1 id="dashboard-title" data-testid="dashboard-title" tabIndex="-1">
          My VA
        </h1>

        <ClaimsAndAppeals />
        <HealthCare />
        <ApplyForBenefits />
      </div>
    </>
  );
};

const mapStateToProps = state => {
  return {
    hero: state.vaProfile?.hero,
    totalDisabilityRating: state.totalRating?.totalDisabilityRating,
  };
};

const mapDispatchToProps = {
  fetchFullName: fetchHeroAction,
  fetchMilitaryInformation: fetchMilitaryInformationAction,
  fetchPersonalInformation: fetchPersonalInformationAction,
  fetchTotalDisabilityRating: fetchTotalDisabilityRatingAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard);
