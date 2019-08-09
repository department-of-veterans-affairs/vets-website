import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import _ from 'lodash';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { getScrollOptions } from '../../../platform/utilities/ui';
import { fetchProfile, setPageTitle, showModal } from '../actions';
import VetTecInstitutionProfile from '../components/vet-tec/VetTecInstitutionProfile';
import { outcomeNumbers } from '../selectors/outcomes';
import InstitutionProfile from '../components/profile/InstitutionProfile';

const { Element: ScrollElement, scroller } = Scroll;

export class ProfilePage extends React.Component {
  componentDidMount() {
    this.props.fetchProfile(
      this.props.params.facilityCode,
      this.props.location.query.version,
    );
  }

  componentDidUpdate(prevProps) {
    const {
      location: {
        query: { version: uuid },
      },
      params: { facilityCode },
      profile,
    } = this.props;

    const institutionName = _.get(profile, 'attributes.name');
    const shouldUpdateTitle = !_.isEqual(
      institutionName,
      _.get(prevProps.profile, 'attributes.name'),
    );

    if (shouldUpdateTitle) {
      this.props.setPageTitle(`${institutionName} - GI Bill® Comparison Tool`);
    }

    if (profile.inProgress !== prevProps.profile.inProgress) {
      scroller.scrollTo('profilePage', getScrollOptions());
    }

    if (prevProps.location.query.version !== uuid) {
      this.props.fetchProfile(facilityCode, uuid);
    }
  }

  handleViewWarnings = () => {
    this._cautionaryInfo.setState({ expanded: true });
  };

  render() {
    const { constants, outcomes, profile } = this.props;

    let content;

    if (profile.inProgress || _.isEmpty(profile.attributes)) {
      content = <LoadingIndicator message="Loading your profile..." />;
    } else {
      const isOJT = profile.attributes.type.toLowerCase() === 'ojt';

      if (profile.attributes.vetTecProvider) {
        content = (
          <VetTecInstitutionProfile
            institution={profile.attributes}
            showModal={this.props.showModal}
          />
        );
      } else {
        content = (
          <InstitutionProfile
            profile={profile}
            isOJT={isOJT}
            constants={constants}
            outcomes={outcomes}
            showModal={this.props.showModal}
          />
        );
      }
    }

    return (
      <ScrollElement name="profilePage" className="profile-page">
        {content}
      </ScrollElement>
    );
  }
}

const mapStateToProps = state => {
  const {
    constants: { constants },
    profile,
  } = state;
  const outcomes = constants ? outcomeNumbers(state) : null;
  return { constants, outcomes, profile };
};

const mapDispatchToProps = {
  fetchProfile,
  setPageTitle,
  showModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfilePage);
