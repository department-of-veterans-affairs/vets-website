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
        We recently updated some of our forms
      </h2>
      <p>
        If you downloaded older copies of VA forms, you may not be able to use
        them anymore. You can download new copies now.
      </p>
    </va-alert>,
    pdfCertWarningElement,
  );
};

export default PdfAlert;
