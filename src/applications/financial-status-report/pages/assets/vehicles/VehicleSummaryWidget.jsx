import React, { useEffect } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { clearJobIndex } from '../../../utils/session';
import {
  EmptyMiniSummaryCard,
  MiniSummaryCard,
} from '../../../components/shared/MiniSummaryCard';

import { currency as currencyFormatter } from '../../../utils/helpers';

const VehicleSummaryWidget = ({
  data,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const { assets } = data;
  const { automobiles } = assets || [];

  useEffect(() => {
    clearJobIndex();
  }, []);

  const handlers = {
    onSubmit: event => {
      event.preventDefault();
      goToPath(`/recreational-vehicles`);
    },
    onBack: event => {
      event.preventDefault();
      goToPath('/vehicles');
    },
  };

  const onDelete = deleteIndex => {
    setFormData({
      ...data,
      questions: {
        ...data.questions,
        hasVehicle: deleteIndex !== 0,
      },
      assets: {
        ...assets,
        automobiles: automobiles.filter(
          (source, index) => index !== deleteIndex,
        ),
      },
    });
  };
  const emptyPrompt = `Select the 'add additional vehicle' link to add another vehicle. Select the continue button to move on to the next question.`;

  return (
    <form onSubmit={handlers.onSubmit}>
      <div className="vads-u-margin-top--3" data-testid="debt-list">
        {!automobiles.length ? (
          <EmptyMiniSummaryCard content={emptyPrompt} />
        ) : (
          automobiles.map((vehicle, index) => (
            <MiniSummaryCard
              editDesination={{
                pathname: '/your-vehicle-records',
                search: `?index=${index}`,
              }}
              heading={`${vehicle.year || ''} ${vehicle.make} ${vehicle.model}`}
              key={vehicle.make + vehicle.model + vehicle.year}
              onDelete={() => onDelete(index)}
              showDelete
              body={<p>Value: {currencyFormatter(vehicle.resaleValue)}</p>}
            />
          ))
        )}
      </div>
      <Link
        className="vads-c-action-link--green"
        to={{
          pathname: '/your-vehicle-records',
          search: `?index=${automobiles.length}`,
        }}
      >
        Add additional vehicle
      </Link>
      {contentBeforeButtons}
      <FormNavButtons goBack={handlers.onBack} submitToContinue />
      {contentAfterButtons}
    </form>
  );
};

VehicleSummaryWidget.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  data: PropTypes.shape({
    assets: PropTypes.array,
    questions: PropTypes.shape({
      hasVehicle: PropTypes.bool,
    }),
  }),
  goBack: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
  testingIndex: PropTypes.number,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default VehicleSummaryWidget;
