import React from 'react';
import { apiRequest } from 'platform/utilities/api';
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
    this.request = apiRequest(`/facilities/va?ids=${facilityIds}`)
      .then(this.handleFacilitiesSuccess)
      .catch(this.handleFacilitiesError);
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
      return <va-loading-indicator message="Loading facilities..." />;
    }

    if (this.state.error) {
      return <FacilityApiAlert />;
    }

    const facilitiesList = sortFacilitiesByName(this.state.facilities).map(
      facility => (
        <div
          key={facility.id}
          className="region-list usa-width-one-whole vads-u-display--flex vads-u-flex-direction--column mobile-lg:vads-u-flex-direction--row facility vads-u-margin-bottom--4"
        >
          <section className="region-grid vads-u-margin-right--2">
            <FacilityTitle
              facility={facility}
              nickname={this.props.facilities[facility.id].nickname}
              regionPath={this.props.facilities[facility.id].entityUrl.path}
            />
            <FacilityAddress facility={facility} />
            <FacilityPhone facility={facility} />
          </section>
          <section className="region-grid vads-u-order--first mobile-lg:vads-u-order--initial vads-u-margin-bottom--2">
            <a
              href={this.props.facilities[facility.id].entityUrl.path}
              aria-label={this.props.facilities[facility.id].nickname}
            >
              <img
                className="region-img"
                src={
                  this.props.facilities[facility.id].derivative
                    ? this.props.facilities[facility.id].derivative.url
                    : ''
                }
                alt={
                  this.props.facilities[facility.id].alt
                    ? this.props.facilities[facility.id].alt
                    : ''
                }
              />
            </a>
          </section>
        </div>
      ),
    );
    return (
      <div className="usa-grid usa-grid-full basic-facilities-list">
        {facilitiesList}
      </div>
    );
  }
}
