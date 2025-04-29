import React from 'react';
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { Dashboard } from './components/dashboard';
import { ExpenseTracker } from './components/expense-tracker';
import { SavingsTracker } from './components/savings-tracker';
import { ThemeSwitcher } from './components/theme-switcher';
import { AppProvider } from './context/app-context';

export default function App() {
  const [selected, setSelected] = React.useState("dashboard");

  return (
    <AppProvider>
      <div className="min-h-screen bg-content1-50 p-2 sm:p-4">
        <div className="max-w-5xl mx-auto">
          <header className="flex justify-between items-center mb-6 px-2">
            <h1 className="text-2xl font-bold text-primary">Finance Tracker</h1>
            <ThemeSwitcher />
          </header>
          
          <Card className="shadow-md">
            <CardBody className="p-0 sm:p-2">
              <Tabs 
                aria-label="Finance Tracker Tabs" 
                selectedKey={selected} 
                onSelectionChange={setSelected}
                className="w-full"
                classNames={{
                  tabList: "px-2 pt-2",
                  panel: "p-0"
                }}
              >
                <Tab key="dashboard" title="Dashboard">
                  <Dashboard />
                </Tab>
                <Tab key="expenses" title="Expenses">
                  <ExpenseTracker />
                </Tab>
                <Tab key="savings" title="Savings">
                  <SavingsTracker />
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
        </div>
      </div>
    </AppProvider>
  );
}