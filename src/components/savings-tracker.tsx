import React from 'react';
import { Button, Card, CardBody, CardHeader, Divider, useDisclosure } from "@heroui/react";
import { Icon } from '@iconify/react';
import { useAppContext } from '../context/app-context';
import { TransactionForm } from './transaction-form';
import { TransactionList } from './transaction-list';
import { MonthPicker } from './month-picker';

export const SavingsTracker = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { savings, deleteTransaction, currentMonth } = useAppContext();
  
  const filteredSavings = savings
    .filter(saving => saving.date.startsWith(currentMonth))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const totalSavings = filteredSavings.reduce((sum, saving) => sum + saving.amount, 0);
  
  return (
    <div className="p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Savings Tracker</h2>
          <p className="text-default-500">
            Total: <span className="font-medium text-success">${totalSavings.toFixed(2)}</span>
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
            Add Saving
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-col gap-1">
          <h3 className="text-lg font-medium">Savings History</h3>
          <p className="text-small text-default-500">
            Showing {filteredSavings.length} {filteredSavings.length === 1 ? 'entry' : 'entries'}
          </p>
        </CardHeader>
        <Divider />
        <CardBody>
          <TransactionList 
            transactions={filteredSavings} 
            type="saving"
            onDelete={deleteTransaction}
          />
        </CardBody>
      </Card>
      
      <TransactionForm isOpen={isOpen} onClose={onClose} type="saving" />
    </div>
  );
};