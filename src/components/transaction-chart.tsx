import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { Transaction } from '../context/app-context';

interface TransactionChartProps {
  expenses: Transaction[];
  savings: Transaction[];
}

export const TransactionChart: React.FC<TransactionChartProps> = ({ expenses, savings }) => {
  const chartData = React.useMemo(() => {
    // Group by day of month
    const dailyData: Record<string, { day: string, expenses: number, savings: number }> = {};
    
    // Process expenses
    expenses.forEach(expense => {
      const day = expense.date.split('-')[2]; // Extract day from YYYY-MM-DD
      if (!dailyData[day]) {
        dailyData[day] = { day, expenses: 0, savings: 0 };
      }
      dailyData[day].expenses += expense.amount;
    });
    
    // Process savings
    savings.forEach(saving => {
      const day = saving.date.split('-')[2]; // Extract day from YYYY-MM-DD
      if (!dailyData[day]) {
        dailyData[day] = { day, expenses: 0, savings: 0 };
      }
      dailyData[day].savings += saving.amount;
    });
    
    // Convert to array and sort by day
    return Object.values(dailyData).sort((a, b) => parseInt(a.day) - parseInt(b.day));
  }, [expenses, savings]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-default-400">
        No transaction data available for this period
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip 
          formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
          labelFormatter={(label) => `Day ${label}`}
        />
        <Legend />
        <Bar dataKey="expenses" name="Expenses" fill="#f31260" />
        <Bar dataKey="savings" name="Savings" fill="#17c964" />
      </BarChart>
    </ResponsiveContainer>
  );
};