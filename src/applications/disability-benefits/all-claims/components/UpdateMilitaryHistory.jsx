import { useEffect } from 'react';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';

import { isBDD } from '../utils';
import { SAVED_SEPARATION_DATE } from '../constants';

export const addServicePeriod = (formData, separationDate, setFormData) => {
  const updateData = newData => {
    window.sessionStorage.removeItem(SAVED_SEPARATION_DATE);
    setFormData({
      ...newData,
      'view:isBddData': true,
    });
  };

  const data = formData;
  if (!data.serviceInformation) {
    data.serviceInformation = { servicePeriods: [] };
  }
  if (!data.serviceInformation.servicePeriods) {
    data.serviceInformation.servicePeriods = [];
  }
  const index = data.serviceInformation.servicePeriods.findIndex(entry => {
    const range = entry.dateRange || {};
    return range.from && !range.to;
  });
  if (index > -1) {
    // User has "from" date, but no "to" date
    data.serviceInformation.servicePeriods[index].dateRange.to = separationDate;
    updateData(data);
  } else if (
    !data.serviceInformation.servicePeriods.find(
      entry => entry.dateRange?.to === separationDate,
    )
  ) {
    // If the separation date doesn't already exists, add a new entry
    data.serviceInformation.servicePeriods.push({
      serviceBranch: '',
      dateRange: { from: '', to: separationDate },
    });
    updateData(data);
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
    if (form.data && isBDD(form.data) && separationDate) {
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
