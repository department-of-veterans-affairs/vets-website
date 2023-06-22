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
  const { automobiles = [] } = assets;

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
      assets: {
        ...assets,
        automobiles: automobiles.filter(
          (source, index) => index !== deleteIndex,
        ),
      },
    });
  };
  const emptyPrompt = `Select the 'add additional vehicle' link to add another vehicle. Select the continue button to move on to the next question.`;
  const cardBody = text => (
    <p>
      Value: <b>{currencyFormatter(text)}</b>
    </p>
  );

  return (
    <form onSubmit={handlers.onSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Your cars or other vehicles</h3>
        </legend>
        <div className="vads-u-margin-top--3" data-testid="debt-list">
          {!automobiles.length ? (
            <EmptyMiniSummaryCard content={emptyPrompt} />
          ) : (
            automobiles.map((vehicle, index) => (
              <MiniSummaryCard
                ariaLabel={`Vehicle ${index + 1} ${vehicle.year || ''} ${
                  vehicle.make
                } ${vehicle.model}`}
                editDestination={{
                  pathname: '/your-vehicle-records',
                  search: `?index=${index}`,
                }}
                heading={`${vehicle.year || ''} ${vehicle.make} ${
                  vehicle.model
                }`}
                key={index + vehicle.make + vehicle.model + vehicle.year}
                onDelete={() => onDelete(index)}
                showDelete
                body={cardBody(vehicle.resaleValue)}
                index={index}
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
      </fieldset>
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
    assets: PropTypes.shape({
      automobiles: PropTypes.arrayOf(
        PropTypes.shape({
          make: PropTypes.string,
          model: PropTypes.string,
          year: PropTypes.string,
          resaleValue: PropTypes.string,
        }),
      ),
    }),
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
