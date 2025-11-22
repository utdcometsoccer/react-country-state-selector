import { type FC } from 'react';
import './LoadingSpinner.css';

export interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ text }) => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner" role="status" aria-label="Loading"></div>
      {text && <span className="loading-spinner-text">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
