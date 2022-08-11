import React from 'react';
import { connect } from 'react-redux';
// import ApprovedConfirmation from '../components/confirmation/ApprovedConfirmation';
// import DeniedConfirmation from '../components/confirmation/DeniedConfirmation';
import UnderReviewConfirmation from '../components/confirmation/UnderReviewConfirmation';

// export const ConfirmationPage = () => <ApprovedConfirmation />;
// export const ConfirmationPage = () => <DeniedConfirmation />;
export const ConfirmationPage = () => <UnderReviewConfirmation />;

export default connect()(ConfirmationPage);
