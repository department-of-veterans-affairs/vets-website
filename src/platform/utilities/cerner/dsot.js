import { connectDrupalStaticDataFileVamcEhr } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/connect';

export const connectDrupalSourceOfTruthCerner = dispatch => {
  connectDrupalStaticDataFileVamcEhr(dispatch);
};
