import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import LearnMoreLabel from '../LearnMoreLabel';

export class VetTecVeteranPrograms extends React.Component {
  programs = () => {
    const { institution } = this.props;

    const firstProgram = _.get(institution, 'programs[0]', {});

    return [
      {
        modal: 'vetgroups',
        text: 'Student Veteran Group',
        link: {
          href: firstProgram.studentVetGroupWebsite,
          text: 'Visit the site',
        },
        available: !!firstProgram.studentVetGroup,
      },
      {
        modal: 'vsoc',
        text: 'VetSuccess on Campus',
        link: {
          href:
            firstProgram.vetSuccessEmail &&
            `mailto:${firstProgram.vetSuccessEmail}`,
          text: `Email ${firstProgram.vetSuccessName}`,
        },
        available: !!firstProgram.vetSuccessName,
      },
    ];
  };

  renderProgramLabel = (program, index) => {
    const icon = program.available ? (
      <va-icon
        id="checkIcon"
        icon="check"
        size={3}
        class="vads-u-padding-right--1"
        aria-hidden="true"
      />
    ) : (
      <va-icon icon="close" size={3} aria-hidden="true" />
    );

    const link =
      (program.available &&
        program.link &&
        program.link.href && (
          <span>
            &nbsp;(
            <a
              href={program.link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {program.link.text}
            </a>
            )
          </span>
        )) ||
      '';
    return (
      <div key={index}>
        {icon}
        <LearnMoreLabel
          text={program.text}
          onClick={this.props.onShowModal.bind(this, program.modal)}
          ariaLabel={program.ariaLabel}
          bold
        />{' '}
        {link}
      </div>
    );
  };

  render() {
    const programs = this.programs();
    const availablePrograms = programs.filter(program => program.available);

    return (
      <div className="programs row">
        {availablePrograms.length > 0 ? (
          <div className="usa-width-one-half medium-6 large-6 vads-u-margin-top--2">
            {availablePrograms.map((program, index) =>
              this.renderProgramLabel(program, index),
            )}
            <br />
          </div>
        ) : (
          <p>
            Please contact the school or their military office directly for
            information on the Veteran programs they offer.
          </p>
        )}
      </div>
    );
  }
}

VetTecVeteranPrograms.propTypes = {
  institution: PropTypes.object,
  onShowModal: PropTypes.func,
};

export default VetTecVeteranPrograms;
