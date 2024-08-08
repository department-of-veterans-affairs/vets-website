import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const isPanelWhite = (mobileMediaQuery, panelWhite) => {
  if (mobileMediaQuery?.matches) {
    return '';
  }

  return panelWhite ? ' panel-white' : '';
};

const Column = props => {
  const {
    mobileMediaQuery,
    data,
    keyName,
    panelWhite,
    columnThreeLinkClicked,
    linkClicked,
    hidden,
  } = props;

  if (keyName === 'columnThree') {
    return (
      <div
        aria-hidden={hidden ? 'true' : 'false'}
        className={`vetnav-panel vetnav-panel--submenu ${_.kebabCase(
          keyName,
        )}${isPanelWhite(mobileMediaQuery, panelWhite)}`}
        aria-label={keyName}
      >
        <div
          className={`${
            panelWhite
              ? 'mm-marketing-container mm-marketing-gray'
              : 'mm-marketing-container'
          }`}
        >
          <img src={data.img.src} alt={data.img.alt} />
          <div className="mm-marketing-text">
            <a
              className="mm-links"
              data-e2e-id={`${_.kebabCase(data.link.text)}`}
              href={data.link.href}
              onClick={columnThreeLinkClicked.bind(null, data.link)}
            >
              {data.link.text}
            </a>
            <p>{data.description}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden={hidden ? 'true' : 'false'}
      className={`vetnav-panel vetnav-panel--submenu ${_.kebabCase(
        keyName,
      )}${isPanelWhite(mobileMediaQuery, panelWhite)}`}
    >
      {data.title ? (
        <h3
          data-e2e-id={`vetnav-${_.kebabCase(keyName)}-header`}
          id={`vetnav-${_.kebabCase(keyName)}-header`}
        >
          {data.title}
        </h3>
      ) : (
        <span>&nbsp;</span>
      )}
      <ul
        id={`vetnav-${_.kebabCase(keyName)}-col`}
        aria-labelledby={`vetnav-${_.kebabCase(keyName)}-header`}
      >
        <li className="panel-top-link">{props.children}</li>

        {data.links.map((link, i) => (
          <li className="mm-link-container" key={`${link.href}-${i}`}>
            <a
              className="mm-links"
              data-e2e-id={`${_.kebabCase(link.text)}-${i}`}
              href={link.href}
              onClick={linkClicked.bind(null, link)}
            >
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

Column.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    links: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired,
      }),
    ),
    img: PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
    }),
    link: PropTypes.shape({
      text: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    }),
    description: PropTypes.string,
  }),
  keyName: PropTypes.string.isRequired,
  navTitle: PropTypes.string.isRequired,
  panelWhite: PropTypes.bool.isRequired,
  linkClicked: PropTypes.func.isRequired,
  columnThreeLinkClicked: PropTypes.func.isRequired,
};

export default Column;
