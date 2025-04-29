import React from 'react';
import { Button, Card, CardBody, CardHeader, Divider, useDisclosure } from "@heroui/react";
import { Icon } from '@iconify/react';
import { useAppContext } from '../context/app-context';
import { TransactionForm } from './transaction-form';
import { TransactionList } from './transaction-list';
import { MonthPicker } from './month-picker';

export const ExpenseTracker = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { expenses, deleteTransaction, currentMonth } = useAppContext();
  
  const filteredExpenses = expenses
    .filter(expense => expense.date.startsWith(currentMonth))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  return (
    <div className="p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Expense Tracker</h2>
          <p className="text-default-500">
            Total: <span className="font-medium text-danger">${totalExpenses.toFixed(2)}</span>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
          <MonthPicker />
          <Button 
            color="primary" 
            onPress={onOpen}
            startContent={<Icon icon="lucide:plus" />}
            className="w-full sm:w-auto"
          >
            Add Expense
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-col gap-1">
          <h3 className="text-lg font-medium">Expense History</h3>
          <p className="text-small text-default-500">
            Showing {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'}
          </p>
        </CardHeader>
        <Divider />
        <CardBody>
          <TransactionList 
            transactions={filteredExpenses} 
            type="expense"
            onDelete={deleteTransaction}
          />
        </CardBody>
      </Card>
      
      <TransactionForm isOpen={isOpen} onClose={onClose} type="expense" />
    </div>
  );
};