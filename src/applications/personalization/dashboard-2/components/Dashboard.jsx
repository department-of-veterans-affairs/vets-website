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

import ProfileHeader from 'applications/personalization/profile/components/ProfileHeader';

import ApplyForBenefits from './apply-for-benefits/ApplyForBenefits';
import ClaimsAndAppeals from './claims-and-appeals/ClaimsAndAppeals';
import HealthCare from './health-care/HealthCare';

const Dashboard = props => {
  useEffect(() => {
    props.fetchFullName();
    props.fetchPersonalInformation();
    props.fetchMilitaryInformation();
    focusElement('#dashboard-title');
  });

  console.log('This is props', props);

  return (
    <>
      {isEmpty(props.hero?.errors) && <ProfileHeader />}
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
  };
};

const mapDispatchToProps = {
  fetchFullName: fetchHeroAction,
  fetchMilitaryInformation: fetchMilitaryInformationAction,
  fetchPersonalInformation: fetchPersonalInformationAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard);
