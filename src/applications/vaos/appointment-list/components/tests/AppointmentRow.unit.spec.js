import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import AppointmentRow from '../AppointmentsPage/AppointmentRow';

function assertTextDecoration(element, style, value) {
  // Check if the property belongs to the CSSStyleDeclaration instance.
  // Also ensure that the property is a numeric index (indicating an inline style)
  const keys = Object.keys(element.style);
  keys.forEach(key => {
    if (
      Object.hasOwn(element.style, key) &&
      !Number.isNaN(Number.parseInt(key, 10)) &&
      element.style[key] === style
    ) {
      expect(element.style.getPropertyValue(element.style[key])).to.equal(
        value,
      );
      return true;
    }
    return false;
  });
  return false;
}

describe('VAOS Component: AppointmentRow', () => {
  it('should display appointment row with defaults', async () => {
    // Arrange
    // Act
    const screen = render(<AppointmentRow />);
    const row = screen.getByRole('row');

    // Assert
    expect(row.classList.contains('vads-u-display--flex'));
    expect(row.classList.contains('vads-u-flex-drection--column'));
  });

  it('should display children', async () => {
    // Arrange
    // Act
    const screen = render(
      <AppointmentRow>
        <p>This is a test</p>
      </AppointmentRow>,
    );
    const row = screen.getByRole('row');

    // Assert
    expect(row.childElementCount).to.equal(1);
  });

  it('should allow for additional classes', async () => {
    // Arrange
    // Act
    const screen = render(<AppointmentRow className="class1" />);
    const row = screen.getByRole('row');

    // Assert
    expect(row.classList.contains('vads-u-display--flex'));
    expect(row.classList.contains('vads-u-flex-drection--column'));
    expect(row.classList.contains('class1'));
  });

  it('should allow for additional styles', async () => {
    // Arrange
    // Act
    const screen = render(<AppointmentRow style={{ margin: 0 }} />);
    const row = screen.getByRole('row');

    // Assert
    expect(assertTextDecoration(row, 'margin', '0px'));
  });
});
