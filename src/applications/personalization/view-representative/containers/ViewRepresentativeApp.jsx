import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import backendServices from 'platform/user/profile/constants/backendServices';
import { RequiredLoginView } from 'platform/user/authorization/components/RequiredLoginView';
import { fetchRepresentative } from 'applications/personalization/view-representative/actions';
import ViewRepresentativeLayout from '../components/ViewRepresentativeLayout';

function ViewRepresentativeApp(props) {
  useEffect(() => {
    props.fetchRepresentative();
  }, []);

  return (
    <div className="vads-l-grid-container vads-u-padding--2">
      <RequiredLoginView
        serviceRequired={backendServices.USER_PROFILE}
        user={props.user}
      >
        <ViewRepresentativeLayout
          user={props.user}
          representative={props.representative}
          searchRepresentative={props.searchRepresentative}
        />
      </RequiredLoginView>
    </div>
  );
}

const mapStateToProps = state => ({
  user: state.user,
  representative: state.representative,
  searchRepresentative: toggleValues(state)[
    FEATURE_FLAG_NAMES.searchRepresentative
  ],
});

const mapDispatchToProps = {
  fetchRepresentative,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewRepresentativeApp);
export { ViewRepresentativeApp };
