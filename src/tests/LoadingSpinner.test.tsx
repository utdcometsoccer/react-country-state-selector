import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import LoadingSpinner from '../components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders spinner with default settings', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });

  it('renders spinner with custom text', () => {
    render(<LoadingSpinner text="Loading data..." />);
    
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('does not render text when not provided', () => {
    const { container } = render(<LoadingSpinner />);
    
    const textElement = container.querySelector('.loading-spinner-text');
    expect(textElement).not.toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    const { container } = render(<LoadingSpinner text="Loading..." />);
    
    expect(container.querySelector('.loading-spinner-container')).toBeInTheDocument();
    expect(container.querySelector('.loading-spinner')).toBeInTheDocument();
    expect(container.querySelector('.loading-spinner-text')).toBeInTheDocument();
  });
});
