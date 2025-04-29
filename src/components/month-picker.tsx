import React from 'react';
import { Select, SelectItem } from "@heroui/react";
import { useAppContext } from '../context/app-context';

export const MonthPicker = () => {
  const { currentMonth, setCurrentMonth } = useAppContext();
  
  const months = React.useMemo(() => {
    const result = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Generate months for current year and previous year
    for (let year = currentYear; year >= currentYear - 1; year--) {
      for (let month = 11; month >= 0; month--) {
        // Skip future months
        if (year === currentYear && month > currentDate.getMonth()) {
          continue;
        }
        
        const monthStr = String(month + 1).padStart(2, '0');
        const value = `${year}-${monthStr}`;
        const label = new Date(year, month).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        });
        
        result.push({ value, label });
      }
    }
    
    return result;
  }, []);

  return (
    <Select
      label="Select Month"
      selectedKeys={[currentMonth]}
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0] as string;
        if (selected) {
          setCurrentMonth(selected);
        }
      }}
      className="w-48"
    >
      {months.map((month) => (
        <SelectItem key={month.value} value={month.value}>
          {month.label}
        </SelectItem>
      ))}
    </Select>
  );
};