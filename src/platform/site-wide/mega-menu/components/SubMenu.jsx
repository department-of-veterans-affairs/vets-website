import React from 'react';
import PropTypes from 'prop-types';
import FocusLock from 'react-focus-lock';
import Column from './Column';
import _ from 'lodash';
import ArrowRightBlueSVG from './arrow-right-blue';

const getColumns = (mobileMediaQuery, columns) => {
  if (mobileMediaQuery.matches) {
    return {
      columnOne: {
        title: columns.columnOne.title,
        links: [...columns.columnOne.links, ...columns.columnTwo.links],
      },
    };
  }

  return columns;
};

const SubMenu = ({
  mobileMediaQuery,
  smallDesktopMediaQuery,
  data,
  id,
  show,
  navTitle,
  handleBackToMenu,
  linkClicked,
  columnThreeLinkClicked,
}) => {
  const { seeAllLink, ...columns } = data;

  if (show) {
    const filteredColumns = getColumns(mobileMediaQuery, columns);

    return (
      <div
        className={mobileMediaQuery.matches ? 'mm-link-container-small' : ''}
        id={id}
        role="group"
      >
        <FocusLock disabled={!mobileMediaQuery.matches}>
          <div>
            <button
              className="back-button"
              aria-controls={`vetnav-${_.kebabCase(navTitle)}`}
              onClick={() => handleBackToMenu()}
            >
              Back to Menu
            </button>
          </div>

          {seeAllLink && (
            <div className="panel-bottom-link">
              <a
                href={seeAllLink.href}
                onClick={linkClicked.bind(null, seeAllLink)}
              >
                {seeAllLink.text}
                <ArrowRightBlueSVG />
              </a>
            </div>
          )}

          {Object.keys(filteredColumns).map(keyName => (
            <Column
              key={keyName}
              data={filteredColumns[keyName]}
              keyName={keyName}
              navTitle={navTitle}
              panelWhite={Object.prototype.hasOwnProperty.call(
                filteredColumns,
                'mainColumn',
              )}
              linkClicked={linkClicked}
              mobileMediaQuery={mobileMediaQuery}
              hidden={
                keyName === 'columnThree' && smallDesktopMediaQuery.matches
              }
              columnThreeLinkClicked={columnThreeLinkClicked}
            />
          ))}
        </FocusLock>
      </div>
    );
  }

  return <div />;
};

SubMenu.propTypes = {
  data: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  navTitle: PropTypes.string.isRequired,
  linkClicked: PropTypes.func.isRequired,
  columnThreeLinkClicked: PropTypes.func.isRequired,
};

export default SubMenu;
