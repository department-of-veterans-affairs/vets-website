import React from 'react';
import { apiRequest } from '../../../platform/utilities/api';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

export default class FacilityListWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }
  componentDidMount() {
    apiRequest(
      `/facilities/va?ids=${this.props.mainFacilities},${
        this.props.otherFacilities
      }`,
    );
  }

  render() {
    if (this.state.loading) {
      return <LoadingIndicator message="Loading facilities..." />;
    }
    return <div>Hello world!</div>;
  }
}
