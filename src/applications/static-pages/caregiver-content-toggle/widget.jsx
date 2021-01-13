import React from 'react';
import { connect } from 'react-redux';

import OnState from './On';

function CaregiverContentToggle() {
  return <OnState />;
}

const mapStateToProps = store => ({
  user: store.user,
});

export default connect(mapStateToProps)(CaregiverContentToggle);
