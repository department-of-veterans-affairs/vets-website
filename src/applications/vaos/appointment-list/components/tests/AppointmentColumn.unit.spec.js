import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import AppointmentColumn from '../AppointmentsPage/AppointmentColumn';

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

describe('VAOS Component: AppointmentColumn', () => {
  it('should display appointment column with defaults', async () => {
    // Arrange
    // Act
    const screen = render(<AppointmentColumn />);
    const column = screen.getByRole('cell');

    // Assert
    expect(column.classList.contains('vads-u-flex--1'));
    expect(column.classList.contains('vads-u-padding-top--0'));

    expect(assertTextDecoration(column, 'text-decoration', 'none'));
  });

  it("should add 'strikethough' text for 'cancelled' prop", async () => {
    // Arrange
    // Act
    const screen = render(<AppointmentColumn canceled />);
    const column = screen.getByRole('cell');

    // Assert
    expect(assertTextDecoration(column, 'text-decoration', 'line-through'));
  });

  it('should display children', async () => {
    // Arrange
    // Act
    const screen = render(
      <AppointmentColumn canceled>
        <p>This is a test</p>
      </AppointmentColumn>,
    );
    const column = screen.getByRole('cell');

    // Assert
    expect(column.childElementCount).to.equal(1);
  });

  it('should allow for additional classes', async () => {
    // Arrange
    // Act
    const screen = render(<AppointmentColumn className="class1" />);
    const column = screen.getByRole('cell');

    // Assert
    expect(column.classList.contains('vads-u-flex--1'));
    expect(column.classList.contains('vads-u-padding-top--0'));
    expect(column.classList.contains('class1'));
  });

  it('should allow for additional styles', async () => {
    // Arrange
    // Act
    const screen = render(<AppointmentColumn style={{ margin: 0 }} />);
    const column = screen.getByRole('cell');

    // Assert
    expect(assertTextDecoration(column, 'margin', '0px'));
  });
});
