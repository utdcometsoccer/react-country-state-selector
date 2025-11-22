import { type FC } from 'react';
import './LoadingIndicator.css';

interface LoadingIndicatorProps {
  message?: string;
  ariaLabel?: string;
}

const LoadingIndicator: FC<LoadingIndicatorProps> = ({ 
  message = 'Loading...', 
  ariaLabel = 'Loading content' 
}) => {
  return (
    <div className="rcss-loading-container" role="status" aria-live="polite" aria-label={ariaLabel}>
      <span className="rcss-loading-spinner" aria-hidden="true">
        <span className="rcss-spinner-ring"></span>
      </span>
      <span className="rcss-loading-message">{message}</span>
    </div>
  );
};

export default LoadingIndicator;
