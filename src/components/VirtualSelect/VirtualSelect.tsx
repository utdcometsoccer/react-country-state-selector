import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import './VirtualSelect.css';

export interface VirtualSelectOption {
  value: string;
  label: string;
  group?: string;
}

export interface VirtualSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: VirtualSelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  'aria-describedby'?: string;
  'aria-required'?: boolean;
  'aria-invalid'?: boolean;
  enableVirtualScrolling?: boolean;
  virtualScrollThreshold?: number;
}

const ITEM_HEIGHT = 35; // Height of each option in pixels
const MAX_VISIBLE_ITEMS = 8; // Maximum number of items visible at once

const VirtualSelect: React.FC<VirtualSelectProps> = ({
  id,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  className,
  disabled = false,
  'aria-describedby': ariaDescribedBy,
  'aria-required': ariaRequired,
  'aria-invalid': ariaInvalid,
  enableVirtualScrolling = true,
  virtualScrollThreshold = 50,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<List>(null);
  
  // Determine if virtual scrolling should be used
  const useVirtualScrolling = enableVirtualScrolling && options.length > virtualScrollThreshold;
  
  // Find the selected option
  const selectedOption = options.find(opt => opt.value === value);
  const selectedLabel = selectedOption?.label || placeholder;
  
  // Group options if any have a group property
  const hasGroups = options.some(opt => opt.group);
  
  // Organize options by groups if applicable
  const organizedOptions: Array<{ type: 'option' | 'group'; option?: VirtualSelectOption; groupLabel?: string }> = [];
  
  if (hasGroups) {
    const ungrouped: VirtualSelectOption[] = [];
    const grouped = new Map<string, VirtualSelectOption[]>();
    
    options.forEach(opt => {
      if (opt.group) {
        if (!grouped.has(opt.group)) {
          grouped.set(opt.group, []);
        }
        grouped.get(opt.group)!.push(opt);
      } else {
        ungrouped.push(opt);
      }
    });
    
    // Add ungrouped options first
    ungrouped.forEach(opt => {
      organizedOptions.push({ type: 'option', option: opt });
    });
    
    // Add grouped options
    Array.from(grouped.entries()).forEach(([groupLabel, groupOptions]) => {
      organizedOptions.push({ type: 'group', groupLabel });
      groupOptions.forEach(opt => {
        organizedOptions.push({ type: 'option', option: opt });
      });
    });
  } else {
    options.forEach(opt => {
      organizedOptions.push({ type: 'option', option: opt });
    });
  }
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;
    
    switch (e.key) {
      case 'Enter':
      case ' ':
        if (!isOpen) {
          e.preventDefault();
          setIsOpen(true);
          // Find current selection index
          const currentIndex = organizedOptions.findIndex(
            item => item.type === 'option' && item.option?.value === value
          );
          setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
        } else if (highlightedIndex >= 0) {
          e.preventDefault();
          const item = organizedOptions[highlightedIndex];
          if (item.type === 'option' && item.option) {
            onChange(item.option.value);
            setIsOpen(false);
          }
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(0);
        } else {
          setHighlightedIndex(prev => {
            let next = prev + 1;
            let attempts = 0;
            // Skip group headers (with safety limit)
            while (next < organizedOptions.length && organizedOptions[next].type === 'group' && attempts < organizedOptions.length) {
              next++;
              attempts++;
            }
            if (next >= organizedOptions.length) {
              next = prev;
            }
            // Scroll to item if using virtual scrolling
            if (useVirtualScrolling && listRef.current) {
              listRef.current.scrollToItem(next, 'auto');
            }
            return next;
          });
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prev => {
            let next = prev - 1;
            let attempts = 0;
            // Skip group headers (with safety limit)
            while (next >= 0 && organizedOptions[next].type === 'group' && attempts < organizedOptions.length) {
              next--;
              attempts++;
            }
            if (next < 0) {
              next = prev;
            }
            // Scroll to item if using virtual scrolling
            if (useVirtualScrolling && listRef.current) {
              listRef.current.scrollToItem(next, 'auto');
            }
            return next;
          });
        }
        break;
      case 'Tab':
        if (isOpen) {
          setIsOpen(false);
        }
        break;
    }
  }, [isOpen, highlightedIndex, organizedOptions, onChange, value, disabled, useVirtualScrolling]);
  
  // Handle option click
  const handleOptionClick = (option: VirtualSelectOption) => {
    onChange(option.value);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };
  
  // Toggle dropdown
  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        // Find current selection index
        const currentIndex = organizedOptions.findIndex(
          item => item.type === 'option' && item.option?.value === value
        );
        setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
      }
    }
  };
  
  // Render a single row in the virtual list
  const EMPTY_STYLE = {}; // Reusable empty style object
  
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = organizedOptions[index];
    
    if (item.type === 'group') {
      return (
        <div
          style={style}
          className="virtual-select-group-label"
          role="presentation"
        >
          {item.groupLabel}
        </div>
      );
    }
    
    const option = item.option!;
    const isSelected = option.value === value;
    const isHighlighted = index === highlightedIndex;
    
    return (
      <div
        style={style}
        className={`virtual-select-option ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''} ${item.option?.group ? 'grouped' : ''}`}
        onClick={() => handleOptionClick(option)}
        onMouseEnter={() => setHighlightedIndex(index)}
        role="option"
        aria-selected={isSelected}
      >
        {option.label}
      </div>
    );
  };
  
  // Calculate dropdown height
  const dropdownHeight = Math.min(
    organizedOptions.length * ITEM_HEIGHT,
    MAX_VISIBLE_ITEMS * ITEM_HEIGHT
  );
  
  return (
    <div
      ref={selectRef}
      className={`virtual-select-container ${className || ''}`}
      onKeyDown={handleKeyDown}
    >
      <div
        id={id}
        className={`virtual-select-trigger ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={handleToggle}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id}-listbox`}
        aria-describedby={ariaDescribedBy}
        aria-required={ariaRequired}
        aria-invalid={ariaInvalid}
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
      >
        <span className="virtual-select-value">{selectedLabel}</span>
        <span className="virtual-select-arrow" aria-hidden="true">▼</span>
      </div>
      
      {isOpen && !disabled && (
        <div
          id={`${id}-listbox`}
          className="virtual-select-dropdown"
          role="listbox"
          aria-label={placeholder}
        >
          {useVirtualScrolling ? (
            <List
              ref={listRef}
              height={dropdownHeight}
              itemCount={organizedOptions.length}
              itemSize={ITEM_HEIGHT}
              width="100%"
            >
              {Row}
            </List>
          ) : (
            <div style={{ maxHeight: dropdownHeight, overflowY: 'auto' }}>
              {organizedOptions.map((item, index) => (
                <Row key={index} index={index} style={EMPTY_STYLE} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VirtualSelect;
