import React from 'react';
import { replaceWithStagingDomain } from 'platform/utilities/environment/stagingDomains';

const PATH = '/education/school-administrators/';
const OnThisPage = () => {
  return (
    <>
      <h3 id="on-this-page">On this page</h3>
      <div className="vads-u-padding-bottom--0p5">
        <ul>
          <li>
            <a
              href={replaceWithStagingDomain(
                `https://www.va.gov${PATH}#training-and-guides`,
              )}
              id="72b20b3b76e127ff2fd30f76c835387d"
            >
              Training and guides
            </a>
          </li>
          <li>
            <a
              href={replaceWithStagingDomain(
                `https://www.va.gov${PATH}#upcoming-events`,
              )}
              id="39e9120a7d6b485c681c66571c7d1a8b"
            >
              Upcoming events
            </a>
          </li>
          <li>
            <a
              href={replaceWithStagingDomain(
                `https://www.va.gov${PATH}#policies-and-procedures`,
              )}
              id="3a097d4afe7fe1ba022abaab3aa7e01f"
            >
              Policies and procedures
            </a>
          </li>
          <li>
            <a
              href={replaceWithStagingDomain(
                `https://www.va.gov${PATH}#other-resources-to-support-you`,
              )}
              id="e6eea31f30e2f33a08e7f7925565bdd1"
            >
              Resources to support students
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default OnThisPage;
