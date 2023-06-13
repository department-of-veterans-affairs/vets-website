import React from 'react';
import PropTypes from 'prop-types';
import MedicationsListCard from './MedicationsListCard';

const MedicationsList = props => {
  const { rxList } = props;

  return (
    <div className="vads-l-row vads-u-flex-direction--column">
      {rxList?.length > 0 &&
        rxList.map(idx => <MedicationsListCard key={idx} />)}
    </div>
  );
};

export default MedicationsList;

MedicationsList.propTypes = {
  rxList: PropTypes.array,
};
