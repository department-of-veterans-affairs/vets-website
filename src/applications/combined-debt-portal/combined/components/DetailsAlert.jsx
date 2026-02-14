import React from 'react';
import CardLinks from './common/CardLinks';
import PhoneNumbers from './common/PhoneNumbers';
import { useStatusContent } from '../hooks/useStatusContent';
import { commonPropTypes } from './common/prop-types/CommonPropTypes';

const DetailsAlert = ({ type, data }) => {
  const {
    transformedData,
    headerText,
    bodyText,
    alertStatus,
    linkIds,
    phoneSet,
  } = useStatusContent(type, data, 'details');

  return (
    <va-alert
      class="vads-u-margin-bottom--1"
      disable-analytics="false"
      data-testid={`details-alert-${transformedData.id}`}
      full-width="false"
      status={alertStatus}
      visible="true"
    >
      <h2 slot="headline">{headerText}</h2>
      <p className="vads-u-margin-bottom--0">{bodyText}</p>
      <PhoneNumbers phoneSet={phoneSet} />
      <CardLinks
        links={linkIds}
        data={data}
        type={type}
        transformed={transformedData}
        view="details"
      />
    </va-alert>
  );
};

DetailsAlert.propTypes = {
  data: commonPropTypes.data,
  type: commonPropTypes.type,
};

export default DetailsAlert;
