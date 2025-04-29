import React from 'react';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button, 
  Input, 
  Select, 
  SelectItem, 
  Textarea 
} from "@heroui/react";
import { Transaction, useAppContext } from '../context/app-context';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'expense' | 'saving';
  editTransaction?: Transaction;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ 
  isOpen, 
  onClose, 
  type,
  editTransaction 
}) => {
  const { addTransaction, updateTransaction, categories } = useAppContext();
  
  const [formData, setFormData] = React.useState({
    date: '',
    amount: '',
    category: '',
    description: ''
  });
  
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  
  React.useEffect(() => {
    if (editTransaction) {
      setFormData({
        date: editTransaction.date,
        amount: editTransaction.amount.toString(),
        category: editTransaction.category,
        description: editTransaction.description
      });
    } else {
      // Set today's date as default
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        date: today,
        amount: '',
        category: '',
        description: ''
      });
    }
  }, [editTransaction, isOpen]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const transaction = {
      date: formData.date,
      amount: Number(formData.amount),
      category: formData.category,
      description: formData.description,
      type
    };
    
    if (editTransaction) {
      updateTransaction({ ...transaction, id: editTransaction.id });
    } else {
      addTransaction(transaction);
    }
    
    onClose();
  };
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const categoryOptions = type === 'expense' ? categories.expense : categories.saving;
  const title = `${editTransaction ? 'Edit' : 'Add'} ${type === 'expense' ? 'Expense' : 'Saving'}`;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  type="date"
                  label="Date"
                  value={formData.date}
                  onValueChange={(value) => handleChange('date', value)}
                  isInvalid={!!errors.date}
                  errorMessage={errors.date}
                  isRequired
                />
                
                <Input
                  type="number"
                  label="Amount"
                  placeholder="0.00"
                  startContent={<div className="pointer-events-none flex items-center">$</div>}
                  value={formData.amount}
                  onValueChange={(value) => handleChange('amount', value)}
                  isInvalid={!!errors.amount}
                  errorMessage={errors.amount}
                  isRequired
                />
                
                <Select
                  label="Category"
                  placeholder="Select a category"
                  selectedKeys={formData.category ? [formData.category] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    handleChange('category', selected || '');
                  }}
                  isInvalid={!!errors.category}
                  errorMessage={errors.category}
                  isRequired
                >
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </Select>
                
                <Textarea
                  label="Description"
                  placeholder="Enter a description"
                  value={formData.description}
                  onValueChange={(value) => handleChange('description', value)}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                {editTransaction ? 'Update' : 'Add'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};