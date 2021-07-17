import { screen, fireEvent } from '@testing-library/dom';
import fs from 'fs';
import path from 'path';

const val = fs
  .readFileSync(path.resolve(__dirname, '../index.html'))
  .toString();

document.write(val);

describe('index.html', () => {
  test('User can see an entry pad containing buttons for the digits 0-9', () => {
    const buttons = screen.getAllByText(/^[0-9]$/);
    const buttonsText = buttons
      .reduce((memo, button) => [...memo, `${button.textContent}`], [])
      .sort((a, b) => +a - +b);

    const test = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    expect(buttons).toHaveLength(10);
    expect(buttonsText).toMatchObject(test);
  });

  test('User can see an entry pad containing buttons for the operations +, -, /, and =', () => {
    const buttons = screen.getAllByText(/\+|-|\/|=$/);
    const buttonsText = buttons.reduce(
      (memo, button) => [...memo, `${button.textContent}`],
      []
    );

    const test = ['+', '-', '/', '='];

    expect(buttons).toHaveLength(4);
    expect(buttonsText).toEqual(expect.arrayContaining(test));
  });

  test("User can see a 'C' clear button (for clear)", () => {
    const button = screen.getByText(/^C$/);
    expect(button).toBeDefined();
  });

  test("User can see an 'AC' clear button (for clear all)", () => {
    const button = screen.getByText(/^AC$/);
    expect(button).toBeDefined();
  });

  test.only('User can enter numbers as sequences up to 8 digits long by clicking on digits in the entry pad', (done) => {
    let test = '';
    try {
      const buttons = screen.getAllByText(/^[0-9]$/g);
      for (let i = 0; i < 8; i++) {
        const button = buttons[i];
        test += button.textContent;
        fireEvent.click(button);
        const { value } = screen.getByText(test);
        expect(value).toEqual(test);
      }

      done();
    } catch (e) {
      throw Error(e);
    }
  });

  test('Entry of any digits more than 8 will be ignored', () => {
    const buttons = screen.getAllByText(/^[0-9]$/);

    let test = '';
    for (let i = 0; i < 8; i++) {
      const button = buttons[i];
      test += button.textContent;
      button.click();
    }

    const remainingButtons = buttons.slice(8);
    remainingButtons.forEach((button) => {
      button.click();
      expect(screen.getByText(test)).toHaveTextContent(test);
    });
  });
});
