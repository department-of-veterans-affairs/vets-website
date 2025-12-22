import React from 'react';

export default function RegionalAccordion() {
  return (
    <va-accordion>
      <va-accordion-item header="Eastern region" id="easter_region">
        <p className="va-address-block">
          VA Regional Office
          <br />
          P.O. Box 4616
          <br />
          Buffalo, NY 1420-4616
          <br />
        </p>
        <p>
          <strong>This office serves the following states:</strong> Colorado,
          Connecticut, Delaware, District of Columbia, Illinois, Indiana, Iowa,
          Kansas, Kentucky, Maine, Maryland, Massachusetts, Michigan, Minnesota,
          Missouri, Montana, Nebraska, New Hampshire, New Jersey, New York,
          North Carolina, North Dakota, Ohio, Pennsylvania, Rhode Island, South
          Dakota, Tennessee, Vermont, Virginia, West Virginia, Wisconsin, and
          Wyoming.
        </p>
        <p>
          <strong>Additional locations served by this office:</strong> APO / FPO
          AA, Foreign Schools, and the U.S. Virgin Islands.
        </p>
      </va-accordion-item>
      <va-accordion-item header="Western region" id="western_region">
        <p className="va-address-block">
          VA Regional Office
          <br />
          P.O. Box 8888
          <br />
          Muskogee, OK 74402-8888
          <br />
        </p>
        <p>
          <strong>This office serves the following states:</strong> Alabama,
          Alaska, Arizona, Arkansas, California, Florida, Georgia, Hawaii,
          Idaho, Louisiana, Mississippi, New Mexico, Nevada, Oklahoma, Oregon,
          South Carolina, Texas, Utah, and Washington.
        </p>
        <p>
          <strong>Additional locations served by this office:</strong> APO / FPO
          AP, Guam, Philippines, American Samoa, and Mariana Islands.
        </p>
      </va-accordion-item>
    </va-accordion>
  );
}
