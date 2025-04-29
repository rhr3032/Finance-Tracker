import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Button,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure
} from "@heroui/react";
import { Icon } from '@iconify/react';
import { Transaction } from '../context/app-context';
import { TransactionForm } from './transaction-form';

interface TransactionListProps {
  transactions: Transaction[];
  type: 'expense' | 'saving';
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  type,
  onDelete
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | undefined>();
  
  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    onOpen();
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-default-400">
        <Icon 
          icon={type === 'expense' ? 'lucide:credit-card' : 'lucide:piggy-bank'} 
          className="w-16 h-16 mb-4" 
        />
        <p className="text-xl mb-2">No {type === 'expense' ? 'expenses' : 'savings'} yet</p>
        <p className="text-center max-w-md mb-6">
          {type === 'expense' 
            ? 'Track your spending by adding your first expense.' 
            : 'Start building your savings by adding your first entry.'}
        </p>
      </div>
    );
  }
  
  return (
    <>
      <Table 
        aria-label={`${type === 'expense' ? 'Expenses' : 'Savings'} table`}
        classNames={{
          wrapper: "max-h-[400px]"
        }}
      >
        <TableHeader>
          <TableColumn>DATE</TableColumn>
          <TableColumn>CATEGORY</TableColumn>
          <TableColumn>DESCRIPTION</TableColumn>
          <TableColumn>AMOUNT</TableColumn>
          <TableColumn width={80}>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No transactions to display.">
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{formatDate(transaction.date)}</TableCell>
              <TableCell>
                <Chip 
                  size="sm" 
                  variant="flat" 
                  color={type === 'expense' ? 'danger' : 'success'}
                >
                  {transaction.category}
                </Chip>
              </TableCell>
              <TableCell>
                {transaction.description || <span className="text-default-400">No description</span>}
              </TableCell>
              <TableCell>
                <span className={type === 'expense' ? 'text-danger' : 'text-success'}>
                  ${transaction.amount.toFixed(2)}
                </span>
              </TableCell>
              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light">
                      <Icon icon="lucide:more-vertical" className="text-default-400" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Transaction actions">
                    <DropdownItem 
                      startContent={<Icon icon="lucide:edit" />}
                      onPress={() => handleEdit(transaction)}
                    >
                      Edit
                    </DropdownItem>
                    <DropdownItem 
                      startContent={<Icon icon="lucide:trash" />}
                      className="text-danger"
                      color="danger"
                      onPress={() => onDelete(transaction.id)}
                    >
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <TransactionForm 
        isOpen={isOpen} 
        onClose={() => {
          onClose();
          setSelectedTransaction(undefined);
        }} 
        type={type}
        editTransaction={selectedTransaction}
      />
    </>
  );
};