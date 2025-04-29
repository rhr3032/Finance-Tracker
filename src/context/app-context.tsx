import React from 'react';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  type: 'expense' | 'saving';
}

interface AppContextType {
  expenses: Transaction[];
  savings: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  categories: {
    expense: string[];
    saving: string[];
  };
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
}

const defaultCategories = {
  expense: ['Food', 'Housing', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other'],
  saving: ['Emergency Fund', 'Retirement', 'Vacation', 'Education', 'Investment', 'Other']
};

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // The AppProvider component already implements localStorage:
  // 1. It loads data from localStorage on initial render:
  const [expenses, setExpenses] = React.useState<Transaction[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [savings, setSavings] = React.useState<Transaction[]>(() => {
    const saved = localStorage.getItem('savings');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. It saves data to localStorage whenever expenses or savings change:
  React.useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  React.useEffect(() => {
    localStorage.setItem('savings', JSON.stringify(savings));
  }, [savings]);

  const [currentMonth, setCurrentMonth] = React.useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID()
    };
    
    if (transaction.type === 'expense') {
      setExpenses(prev => [...prev, newTransaction]);
    } else {
      setSavings(prev => [...prev, newTransaction]);
    }
  };

  const updateTransaction = (transaction: Transaction) => {
    if (transaction.type === 'expense') {
      setExpenses(prev => prev.map(item => 
        item.id === transaction.id ? transaction : item
      ));
    } else {
      setSavings(prev => prev.map(item => 
        item.id === transaction.id ? transaction : item
      ));
    }
  };

  const deleteTransaction = (id: string) => {
    setExpenses(prev => prev.filter(item => item.id !== id));
    setSavings(prev => prev.filter(item => item.id !== id));
  };

  const value = {
    expenses,
    savings,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    categories: defaultCategories,
    currentMonth,
    setCurrentMonth
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};