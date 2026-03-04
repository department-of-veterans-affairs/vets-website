import React from 'react';
import { Trans } from 'react-i18next';
import CardLinks from './common/CardLinks';
import CardIcon from './common/CardIcon';
import { useStatusContent } from '../hooks/useStatusContent';
import { commonPropTypes } from './common/prop-types/CommonPropTypes';

const SummaryCard = ({ type, data }) => {
  const {
    transformedData,
    messageKey,
    messageValues,
    alertStatus,
    linkIds,
  } = useStatusContent(type, data, 'summary');

  return (
    <div className="vads-u-margin-y--2">
      <va-card
        show-shadow
        class="vads-u-padding--3 vads-u-margin-bottom--3"
        data-testid={`summary-card-${transformedData.id}`}
      >
        <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--1p5 vads-u-font-size--h3">
          {transformedData.header}
        </h2>
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--1p5 vads-u-font-size--h4 vads-u-font-family--serif">
          <span className="vads-u-font-weight--normal">Current balance: </span>
          <strong>{transformedData.amount}</strong>
        </p>
        <div className="vads-u-display--flex vads-u-margin-bottom--1p5">
          <CardIcon type={alertStatus} />
          <p className="vads-u-margin-y--0">
            <Trans i18nKey={messageKey} values={messageValues} />
          </p>
        </div>
        <CardLinks
          links={linkIds}
          data={data}
          type={type}
          transformed={transformedData}
          view="summary"
        />
      </va-card>
    </div>
  );
};

SummaryCard.propTypes = {
  data: commonPropTypes.data,
  type: commonPropTypes.type,
};

export default SummaryCard;
