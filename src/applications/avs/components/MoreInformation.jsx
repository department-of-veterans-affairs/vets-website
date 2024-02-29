import React from 'react';
import PropTypes from 'prop-types';

import ItemsBlock from './ItemsBlock';
import ParagraphBlock from './ParagraphBlock';

const MoreInformation = props => {
  const { avs } = props;
  const { clinicalServices, clinicsVisited, moreHelpAndInformation } = avs;

  const renderClinicalService = service => {
    return (
      <>
        <h4>{service.name}</h4>
        <p>
          Location: {service.location}
          <br />
          Hours of operation: {service.hours}
          <br />
          Phone: <va-telephone contact={service.phone.replace(/\D/g, '')} />
          <br />
          Comment: {service.comment}
        </p>
      </>
    );
  };

  return (
    <div>
      <ItemsBlock
        heading={`Clinical services (${clinicsVisited[0]?.site})`}
        itemType="clinical-services"
        items={clinicalServices}
        renderItem={renderClinicalService}
      />
      <ParagraphBlock
        heading="More help and information"
        content={moreHelpAndInformation}
        htmlContent
      />
    </div>
  );
};

export default MoreInformation;

MoreInformation.propTypes = {
  avs: PropTypes.object,
};
