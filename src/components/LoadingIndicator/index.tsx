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
    <div className="rcss-loading-container" role="status" aria-label={ariaLabel}>
      <div className="rcss-loading-spinner" aria-hidden="true">
        <div className="rcss-spinner-ring"></div>
      </div>
      <span className="rcss-loading-message">{message}</span>
    </div>
  );
};

export default LoadingIndicator;
