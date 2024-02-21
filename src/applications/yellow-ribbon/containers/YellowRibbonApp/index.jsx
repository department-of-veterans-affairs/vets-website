import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import FindYellowRibbonPage from '../../components/FindYellowRibbonPage';
import SearchResultsPage from '../../components/SearchResultsPage';
import manifest from '../../manifest.json';
import { getYellowRibbonAppState } from '../../helpers/selectors';

export const YellowRibbonApp = ({ hasFetchedOnce }) => {
  const breadcrumbList = [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/education',
      label: 'Education and training',
    },
    {
      href: manifest.rootUrl,
      label: 'Find a Yellow Ribbon school',
    },
  ];

  if (hasFetchedOnce) {
    breadcrumbList.push({
      href: window.location.href,
      label: 'Search results',
    });
  }

  return (
    <div
      className="vads-l-grid-container vads-u-padding-x--1p5 vads-u-padding-bottom--4"
      data-e2e-id="yellow-ribbon-app"
    >
      <VaBreadcrumbs
        class="vads-u-padding-x--0 vads-u-padding-y--1p5 medium-screen:vads-u-padding-y--0"
        label="Breadcrumbs"
        uswds
        breadcrumbList={breadcrumbList}
      />
      {hasFetchedOnce ? <SearchResultsPage /> : <FindYellowRibbonPage />}
    </div>
  );
};

YellowRibbonApp.propTypes = {
  hasFetchedOnce: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  hasFetchedOnce: getYellowRibbonAppState(state).hasFetchedOnce,
});

export default connect(
  mapStateToProps,
  null,
)(YellowRibbonApp);
