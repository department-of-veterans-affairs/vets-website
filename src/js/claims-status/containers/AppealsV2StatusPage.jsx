import React from 'react';

import History from '../components/appeals-v2/History';
import CurrentStatus from '../components/appeals-v2/CurrentStatus';
import Alerts from '../components/appeals-v2/Alerts';
import WhatsNext from '../components/appeals-v2/WhatsNext';
import Docket from '../components/appeals-v2/Docket';

/**
 * AppealsV2StatusPage is in charge of the layout of the status page and is the source of truth
 * for the redux state. All child components shouldn't need to be connected to the store.
 */
class AppealsV2StatusPage extends React.Component {
  render() {
    return (
      <div>
        <History/>
        <CurrentStatus/>
        <Alerts/>
        <WhatsNext/>
        <Docket/>
      </div>
    );
  }
}

export default AppealsV2StatusPage;

