import React from 'react';
import { apiRequest } from '../../../platform/utilities/api';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import FacilityTitle from './FacilityTitle';
import FacilityAddress from './FacilityAddress';
import FacilityPhone from './FacilityPhone';
import FacilityApiAlert from './FacilityApiAlert';
import { sortFacilitiesByName } from './facilityUtilities';

export default class BasicFacilityListWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    const facilityIds = Object.keys(this.props.facilities);
    this.request = apiRequest(
      `/facilities/va?ids=${facilityIds}`,
      null,
      this.handleFacilitiesSuccess,
      this.handleFacilitiesError,
    );
  }

  handleFacilitiesSuccess = facilities => {
    this.setState({
      loading: false,
      facilities: facilities.data,
    });
  };

  handleFacilitiesError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  render() {
    if (this.state.loading) {
      return <LoadingIndicator message="Loading facilities..." />;
    }

    if (this.state.error) {
      return <FacilityApiAlert />;
    }

    const facilitiesList = sortFacilitiesByName(this.state.facilities).map(
      facility => (
        <div key={facility.id} className="usa-width-one-half">
          <FacilityTitle
            facility={facility}
            nickname={this.props.facilities[facility.id].nickname}
            regionPath={this.props.path}
          />
          <FacilityAddress facility={facility} />
          <FacilityPhone facility={facility} />
        </div>
      ),
    );
    return <div className="usa-grid usa-grid-full">{facilitiesList}</div>;
  }
}
