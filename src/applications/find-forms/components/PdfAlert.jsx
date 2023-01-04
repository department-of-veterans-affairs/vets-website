import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const PdfAlert = () => {
  const pdfCertWarningId = 'pdf-cert-warning';
  const pdfCertWarningElement = document.getElementById(pdfCertWarningId);
  const [
    pdfCertWarningElementCreated,
    setPdfCertWarningElementCreated,
  ] = useState(false);

  useEffect(() => {
    const domNode = document.createElement('div');
    domNode.setAttribute('id', pdfCertWarningId);

    const introTextNode = document.getElementsByClassName('va-introtext')[0];
    const introTextParentNode = introTextNode?.parentNode;
    if (introTextNode && introTextParentNode) {
      introTextParentNode.insertBefore(domNode, introTextNode);
      setPdfCertWarningElementCreated(true);
    }
  }, []);

  if (!pdfCertWarningElementCreated || !pdfCertWarningElement) {
    return <></>;
  }

  return ReactDOM.createPortal(
    <va-alert>
      <h2 slot="headline" className="vads-u-font-size--h3">
        We’re updating our forms
      </h2>
      <p>
        After January 7, 2023, you won’t be able to use VA forms that have a
        “last updated” date before March 2022. If you downloaded any of these
        older VA forms, you may need to download new copies in January.
      </p>
    </va-alert>,
    pdfCertWarningElement,
  );
};

export default PdfAlert;
