import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import LoadingIndicator from '../components/LoadingIndicator';

describe('LoadingIndicator', () => {
  it('renders with default message', () => {
    render(<LoadingIndicator />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<LoadingIndicator message="Loading country information..." />);
    
    expect(screen.getByText('Loading country information...')).toBeInTheDocument();
  });

  it('has proper ARIA label for accessibility', () => {
    render(<LoadingIndicator ariaLabel="Loading content" />);
    
    const statusElement = screen.getByRole('status');
    expect(statusElement).toHaveAttribute('aria-label', 'Loading content');
  });

  it('has custom ARIA label when provided', () => {
    render(<LoadingIndicator ariaLabel="Loading language information" />);
    
    const statusElement = screen.getByRole('status');
    expect(statusElement).toHaveAttribute('aria-label', 'Loading language information');
  });

  it('renders spinner with aria-hidden', () => {
    const { container } = render(<LoadingIndicator />);
    
    const spinner = container.querySelector('.rcss-loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<LoadingIndicator />);
    
    expect(container.querySelector('.rcss-loading-container')).toBeInTheDocument();
    expect(container.querySelector('.rcss-loading-spinner')).toBeInTheDocument();
    expect(container.querySelector('.rcss-spinner-ring')).toBeInTheDocument();
    expect(container.querySelector('.rcss-loading-message')).toBeInTheDocument();
  });

  it('message is visible to screen readers', () => {
    render(<LoadingIndicator message="Custom loading message" />);
    
    const message = screen.getByText('Custom loading message');
    expect(message).toBeInTheDocument();
    expect(message).toHaveClass('rcss-loading-message');
  });

  it('uses default aria-label when not provided', () => {
    render(<LoadingIndicator />);
    
    const statusElement = screen.getByRole('status');
    expect(statusElement).toHaveAttribute('aria-label', 'Loading content');
  });
});
