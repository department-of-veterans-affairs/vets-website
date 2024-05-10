import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { scrollToTop } from '@department-of-veterans-affairs/platform-utilities/ui';
import { getDocumentation } from '../api/rxApi';

const PrescriptionDetailsDocumentation = () => {
  const [htmlContent, setHtmlContent] = useState(null);
  const { prescriptionId } = useParams();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const ndcNumber = queryParams.get('ndc');
  useEffect(
    () => {
      if (prescriptionId && ndcNumber) {
        getDocumentation(prescriptionId, ndcNumber).then(response => {
          scrollToTop();
          setHtmlContent(response.data);
        });
      }
      return () => {};
    },
    [prescriptionId, ndcNumber],
  );

  // eslint-disable-next-line react/no-danger
  return <div dangerouslySetInnerHTML={{ __html: htmlContent ?? '' }} />;
};

export default PrescriptionDetailsDocumentation;
