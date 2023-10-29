import React from 'react';
import { render, screen } from '@testing-library/react';
import Masterpage from './Masterpage';

test('renders learn react link', () => {
  render(<Masterpage />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
