import { useEffect } from 'react';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';

import { SAVED_SEPARATION_DATE } from '../constants';

export const addServicePeriod = (formData, separationDate, setFormData) => {
  const data = formData;
  if (!data.serviceInformation) {
    data.serviceInformation = { servicePeriods: [] };
  }
  if (!data.serviceInformation.servicePeriods) {
    data.serviceInformation.servicePeriods = [];
  }
  if (
    !data.serviceInformation.servicePeriods.find(
      entry => entry.dateRange?.to === separationDate,
    )
  ) {
    data.serviceInformation.servicePeriods.push({
      serviceBranch: '',
      dateRange: { from: '', to: separationDate },
    });
    window.sessionStorage.removeItem(SAVED_SEPARATION_DATE);
    setFormData(data);
  }
};

// Originally added to the military history page, but the setData function would
// not update until after render of the array field. This component returns null
// because it's added as a component to the veteran info page in the 'ui:title',
// but there is no title to render
export const UpdateMilitaryHistory = ({ form = {}, setFormData }) => {
  // Get date from Wizard if user entered a valid BDD separation date
  const separationDate = window.sessionStorage.getItem(SAVED_SEPARATION_DATE);
  useEffect(() => {
    if (form.data && separationDate) {
      addServicePeriod(form.data, separationDate, setFormData);
    }
  });
  return null;
};

const mapStateToProps = state => state;
const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UpdateMilitaryHistory);
