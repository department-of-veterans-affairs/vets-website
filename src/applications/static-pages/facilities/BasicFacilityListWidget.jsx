import React from 'react';
import { apiRequest } from '../../../platform/utilities/api';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import FacilityTitle from './FacilityTitle';
import FacilityAddress from './FacilityAddress';
import FacilityPhone from './FacilityPhone';

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
    this.setState({ error: true });
  };

  facilitiesList = facilities =>
    facilities.sort((a, b) => {
      const aName = a.attributes.name;
      const bName = b.attributes.name;
      if (aName < bName) {
        return -1;
      }

      if (aName > bName) {
        return 1;
      }

      return 0;
    });

  render() {
    if (this.state.loading) {
      return <LoadingIndicator message="Loading facilities..." />;
    }

    const facilitiesList = this.facilitiesList(this.state.facilities).map(
      facility => (
        <div
          key={facility.id}
          className="usa-width-one-whole vads-u-margin-bottom--2"
        >
          <section className="usa-width-two-thirds">
            <FacilityTitle
              facility={facility}
              nickname={this.props.facilities[facility.id].nickname}
              regionPath={this.props.path}
            />
            <FacilityAddress facility={facility} />
            <FacilityPhone facility={facility} />
          </section>
          <section className="usa-width-one-third">
            <img
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
          </section>
        </div>
      ),
    );
    return <div className="usa-grid usa-grid-full">{facilitiesList}</div>;
  }
}
