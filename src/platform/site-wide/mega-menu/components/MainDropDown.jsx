import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { togglePanelOpen } from '../actions';
import MenuSection from './MenuSection';
import SubMenu from './SubMenu';

const defaultSection = (sections) => {
  return sections[0].title;
};

const MainDropDown = ({
  handleOnClick,
  title,
  currentDropdown,
  currentSection,
  data,
  updateCurrentSection,
}) => (
  <li>
    {
      data.menuSections ? <button
        aria-expanded={currentDropdown === title}
        aria-controls="vetnav-explore"
        aria-haspopup="true"
        className="vetnav-level1"
        onClick={() => handleOnClick(title)}>{title}</button>
        : <a href={data.href} className="vetnav-level1" id="pgdpevffu88i">{title}</a>
    }

    {
      title === currentDropdown && data.menuSections && <div id="vetnav-explore" className="vetnav-panel" role="none">
        <ul role="menu" aria-label="Explore benefits">
          {
            data.menuSections.constructor.name === 'Array' ? data.menuSections.map((section, j) => {
              return (
                <MenuSection
                  key={section + j}
                  title={section.title}
                  defaultSection={defaultSection(data.menuSections)}
                  currentSection={currentSection}
                  updateCurrentSection={updateCurrentSection}
                  links={section.links}></MenuSection>
              );
            }) : <SubMenu data={data.menuSections} show></SubMenu>
          }
        </ul>
      </div>
    }
  </li>
);

MainDropDown.propTypes = {
  title: PropTypes.string.isRequired,
};

MainDropDown.defaultProps = {
};

const mapStateToProps = ({ megaMenu }) => {
  return {
    ...megaMenu,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleOnClick: (currentDropdown) => {
      dispatch(togglePanelOpen(currentDropdown));
    },
    updateCurrentSection: (currentSection) => {
      dispatch({
        type: 'UPDATE_CURRENT_SECTION',
        currentSection,
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainDropDown);
