import React from 'react';
import { Card, CardBody, CardHeader, Divider, Select, SelectItem, Progress } from "@heroui/react";
import { Icon } from '@iconify/react';
import { useAppContext, Transaction } from '../context/app-context';
import { MonthPicker } from './month-picker';
import { SummaryCard } from './summary-card';
import { TransactionChart } from './transaction-chart';

export const Dashboard = () => {
  const { expenses, savings, currentMonth } = useAppContext();
  
  const filteredExpenses = expenses.filter(expense => 
    expense.date.startsWith(currentMonth)
  );
  
  const filteredSavings = savings.filter(saving => 
    saving.date.startsWith(currentMonth)
  );
  
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalSavings = filteredSavings.reduce((sum, saving) => sum + saving.amount, 0);
  const totalBalance = totalSavings - totalExpenses;
  
  const savingsRate = totalExpenses > 0 ? 
    Math.round((totalSavings / (totalExpenses + totalSavings)) * 100) : 0;
  
  // Get top expense categories
  const expensesByCategory = filteredExpenses.reduce((acc: Record<string, number>, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});
  
  const topExpenseCategories = Object.entries(expensesByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  return (
    <div className="p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl font-semibold mb-2 sm:mb-0">Financial Overview</h2>
        <MonthPicker />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard 
          title="Expenses"
          amount={totalExpenses}
          icon="lucide:credit-card"
          color="danger"
        />
        <SummaryCard 
          title="Savings"
          amount={totalSavings}
          icon="lucide:piggy-bank"
          color="success"
        />
        <SummaryCard 
          title="Balance"
          amount={totalBalance}
          icon="lucide:wallet"
          color={totalBalance >= 0 ? "primary" : "danger"}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-medium">Monthly Trends</h3>
            <p className="text-small text-default-500">Expenses vs Savings</p>
          </CardHeader>
          <Divider />
          <CardBody>
            <TransactionChart expenses={filteredExpenses} savings={filteredSavings} />
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-medium">Savings Rate</h3>
            <p className="text-small text-default-500">Percentage of income saved</p>
          </CardHeader>
          <Divider />
          <CardBody className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-default-500">Current Rate</span>
              <span className="text-lg font-semibold">{savingsRate}%</span>
            </div>
            <Progress 
              value={savingsRate} 
              color={savingsRate >= 20 ? "success" : savingsRate >= 10 ? "warning" : "danger"}
              className="h-3"
              aria-label="Savings rate"
            />
            <div className="flex justify-between text-small text-default-400">
              <span>0%</span>
              <span>Target: 20%</span>
              <span>50%</span>
            </div>
          </CardBody>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-col gap-1">
          <h3 className="text-lg font-medium">Top Expense Categories</h3>
          <p className="text-small text-default-500">Where your money is going</p>
        </CardHeader>
        <Divider />
        <CardBody>
          {topExpenseCategories.length > 0 ? (
            <div className="space-y-4">
              {topExpenseCategories.map(([category, amount], index) => (
                <div key={category} className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span>{category}</span>
                    <span className="font-medium">${amount.toFixed(2)}</span>
                  </div>
                  <Progress 
                    value={(amount / totalExpenses) * 100} 
                    color={index === 0 ? "danger" : index === 1 ? "warning" : "primary"}
                    className="h-2"
                    aria-label={`${category} expenses`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-default-400">
              <Icon icon="lucide:bar-chart-3" className="w-12 h-12 mb-2" />
              <p>No expense data available for this month</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};