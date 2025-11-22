import React from 'react';

/**
 * Generic type for items that can be grouped
 */
export interface GroupableItem {
  code: string;
  name: string;
  group?: string;
}

/**
 * Renders options with optional optgroup support
 * @param items - Array of items with code, name, and optional group
 * @returns JSX elements for rendering options with or without optgroups
 */
export function renderGroupedOptions<T extends GroupableItem>(items: T[]): React.ReactNode {
  // Check if any item has a group property
  const hasGroups = items.some(item => item.group);

  if (!hasGroups) {
    // No groups - render simple options
    return items.map((item) => (
      <option key={item.code} value={item.code}>
        {item.name}
      </option>
    ));
  }

  // Group items by their group property
  const grouped = new Map<string, T[]>();
  const ungrouped: T[] = [];

  items.forEach(item => {
    if (item.group) {
      if (!grouped.has(item.group)) {
        grouped.set(item.group, []);
      }
      grouped.get(item.group)!.push(item);
    } else {
      ungrouped.push(item);
    }
  });

  // Render ungrouped items first, then grouped items
  return (
    <>
      {ungrouped.map((item) => (
        <option key={item.code} value={item.code}>
          {item.name}
        </option>
      ))}
      {Array.from(grouped.entries()).map(([groupName, groupItems]) => (
        <optgroup key={groupName} label={groupName}>
          {groupItems.map((item) => (
            <option key={item.code} value={item.code}>
              {item.name}
            </option>
          ))}
        </optgroup>
      ))}
    </>
  );
}
