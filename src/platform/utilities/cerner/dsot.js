import { connectJsonStaticDataFileVamcEhr } from 'platform/site-wide/json-static-data/source-files/vamc-ehr/connect';

export const connectDrupalSourceOfTruthCerner = dispatch => {
  connectJsonStaticDataFileVamcEhr(dispatch);
};
