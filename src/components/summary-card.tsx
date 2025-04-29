import React from 'react';
import { Card, CardBody } from "@heroui/react";
import { Icon } from '@iconify/react';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: string;
  color: 'primary' | 'success' | 'danger' | 'warning';
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  amount, 
  icon, 
  color 
}) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-500',
    success: 'bg-success-100 text-success-500',
    danger: 'bg-danger-100 text-danger-500',
    warning: 'bg-warning-100 text-warning-500'
  };

  return (
    <Card shadow="sm" className="border border-default-200">
      <CardBody className="flex flex-row items-center gap-4 p-4">
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon icon={icon} className="w-6 h-6" />
        </div>
        <div>
          <p className="text-default-500 text-sm">{title}</p>
          <p className="text-xl font-semibold">
            ${Math.abs(amount).toFixed(2)}
          </p>
        </div>
      </CardBody>
    </Card>
  );
};