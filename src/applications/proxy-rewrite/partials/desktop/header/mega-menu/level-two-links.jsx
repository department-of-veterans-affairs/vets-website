/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import React from 'react';
import PropTypes from 'prop-types';
import { kebabCase } from 'lodash';
import LevelThreeLinks from './level-three-links';
import { updateLinkDomain } from '../../../../utilities/links';
import { keyDownHandler } from '../../../../utilities/keydown';

// Build nested children (e.g. Hub links, About VA child links)
const LevelTwoLinks = ({
  levelTwoIndexOpen,
  sectionData,
  setLevelTwoIndexOpen,
}) => {
  if (Array.isArray(sectionData)) {
    return sectionData.map((section, index) => {
      const { links, title } = section;
      const sectionIsOpen = levelTwoIndexOpen === index;

      if (links) {
        return (
          <li className="mm-link-container" key={index}>
            <button
              aria-expanded={sectionIsOpen}
              className="vetnav-level2"
              aria-controls={`vetnav-${kebabCase(title)}-ms`}
              onClick={() => setLevelTwoIndexOpen(index)}
              onKeyDown={event =>
                keyDownHandler(event, setLevelTwoIndexOpen, index)
              }
            >
              {title}
            </button>
            <div
              id={`vetnav-${kebabCase(title)}-ms`}
              role="group"
              hidden={!sectionIsOpen}
            >
              <button
                className="back-button"
                aria-controls={`vetnav-${kebabCase(title)}`}
              >
                Back to Menu
              </button>
              <LevelThreeLinks section={section} aboutVA={false} />
            </div>
          </li>
        );
      }

      return (
        <li className="mm-link-container" key={index}>
          <a
            className="vetnav-level2"
            href={updateLinkDomain(section.href)}
          >
            {section.text}
          </a>
        </li>
      );
    });
  }

  return <LevelThreeLinks section={sectionData} aboutVA />;
};

LevelTwoLinks.propTypes = {
  setLevelTwoIndexOpen: PropTypes.func.isRequired,
  levelTwoIndexOpen: PropTypes.number,
  sectionData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default LevelTwoLinks;
