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
    <va-alert uswds={false}>
      <h2 slot="headline" className="vads-u-font-size--h3">
        Use the latest version of Acrobat Reader
      </h2>
      <p>
        Some VA forms may not work with older versions of Acrobat Reader. You
        may also need to download a new copy of the VA form.&nbsp;
        <va-link
          href="https://get.adobe.com/reader/"
          text="Get Acrobat Reader for free from Adobe"
        />
      </p>
    </va-alert>,
    pdfCertWarningElement,
  );
};

export default PdfAlert;
