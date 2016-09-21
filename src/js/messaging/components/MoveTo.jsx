import React from 'react';

import ButtonCreateFolder from './buttons/ButtonCreateFolder';
import ButtonMove from './buttons/ButtonMove';
import { folderIds } from '../config';

class MoveTo extends React.Component {
  render() {
    return (
      <div className="msg-move-to">
        <ButtonMove onClick={this.props.onToggleMoveTo}/>
        <form hidden={this.props.isOpen}>
          <fieldset onChange={this.props.onChooseFolder}>
            <legend className="usa-sr-only">
              Move this message to
            </legend>
            <ul className="msg-move-to-options">
              <li>
                <input
                    className="msg-hidden-radio"
                    type="radio"
                    id="msg-moveto-deleted"
                    value={folderIds.DELETED}/>
                <label htmlFor="msg-moveto-deleted">Deleted</label>
              </li>
              <li><ButtonCreateFolder onClick={this.props.onCreateFolder}/></li>
            </ul>
          </fieldset>
        </form>
      </div>
    );
  }
}

MoveTo.propTypes = {
  isOpen: React.PropTypes.bool,
  onChooseFolder: React.PropTypes.func.isRequired,
  onCreateFolder: React.PropTypes.func.isRequired,
  onToggleMoveTo: React.PropTypes.func.isRequired,
};

export default MoveTo;
