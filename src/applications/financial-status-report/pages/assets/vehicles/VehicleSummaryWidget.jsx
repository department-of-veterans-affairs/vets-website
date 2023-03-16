import React, { useEffect, useState } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { Link } from 'react-router';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { clearJobIndex } from '../../../utils/session';
import {
  EmptyMiniSummaryCard,
  MiniSummaryCard,
} from '../../../components/shared/MiniSummaryCard';

import { currency as currencyFormatter } from '../../../utils/helpers';

const EmploymentHistoryWidget = props => {
  const dispatch = useDispatch();

  const { goToPath, goBack, onReviewPage } = props;
  const [hasAdditionalVehicleToAdd, setHasAdditionalVehicleoAdd] = useState(
    'false',
  );

  const formData = useSelector(state => state.form.data);
  const { assets } = formData;
  const { automobiles } = assets || [];

  useEffect(() => {
    clearJobIndex();
  }, []);

  const handlers = {
    onSubmit: event => {
      event.preventDefault();
      if (hasAdditionalVehicleToAdd === 'true') {
        goToPath(`/your-vehicle-records`);
      } else {
        goToPath(`/recreational-vehicles`);
      }
    },
    onSelection: event => {
      const { value } = event?.detail || {};
      if (value) {
        setHasAdditionalVehicleoAdd(value);
      }
    },
  };

  const onDelete = deleteIndex => {
    dispatch(
      setData({
        ...formData,
        assets: {
          ...assets,
          automobiles: automobiles.filter(
            (source, index) => index !== deleteIndex,
          ),
        },
      }),
    );
  };
  const emptyPrompt = `Select the 'add additional vehicle' link to add another vehicle. Select the continue button to move on to the next question.`;

  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const updateButton = <button type="submit">Review update button</button>;

  return (
    <form onSubmit={handlers.onSubmit}>
      <div className="vads-u-margin-top--3" data-testid="debt-list">
        {!automobiles.length ? (
          <EmptyMiniSummaryCard content={emptyPrompt} />
        ) : (
          automobiles.map((vehicle, index) => (
            <MiniSummaryCard
              editDestination={{
                pathname: '/your-vehicle-records',
                search: `?index=${index}`,
              }}
              heading={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
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
      {onReviewPage ? updateButton : navButtons}
    </form>
  );
};

const mapStateToProps = ({ form }) => {
  return {
    formData: form.data,
    employmentHistory: form.data.personalData.employmentHistory,
  };
};

export default connect(mapStateToProps)(EmploymentHistoryWidget);
