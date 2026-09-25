import React from 'react';
import {
  Hotel,
  Utensils,
  Car,
  Ticket,
  ShoppingBag,
  DollarSign,
  PieChart,
} from 'lucide-react';
import Card from './Card';

export const BudgetBreakdown = ({ breakdown = {}, totalBudget = 0, currency = 'USD' }) => {
  const items = [
    {
      key: 'accommodation',
      label: 'Accommodation',
      amount: breakdown.accommodation || 0,
      icon: Hotel,
      color: 'bg-sky-500',
      lightColor: 'bg-sky-50 text-sky-600 border-sky-100',
    },
    {
      key: 'food',
      label: 'Food & Dining',
      amount: breakdown.food || 0,
      icon: Utensils,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      key: 'transportation',
      label: 'Transportation',
      amount: breakdown.transportation || 0,
      icon: Car,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      key: 'activities',
      label: 'Activities & Tours',
      amount: breakdown.activities || 0,
      icon: Ticket,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50 text-purple-600 border-purple-100',
    },
    {
      key: 'miscellaneous',
      label: 'Miscellaneous & Souvenirs',
      amount: breakdown.miscellaneous || 0,
      icon: ShoppingBag,
      color: 'bg-rose-500',
      lightColor: 'bg-rose-50 text-rose-600 border-rose-100',
    },
  ];

  const calculatedSum = items.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const baseline = totalBudget > 0 ? totalBudget : calculatedSum || 1;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Estimated Budget Breakdown</h3>
            <p className="text-xs text-slate-500">Suggested financial allocation for this trip</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 font-medium">Total Planned</span>
          <div className="text-lg font-extrabold text-slate-900">
            {Number(totalBudget || calculatedSum).toLocaleString()} {currency}
          </div>
        </div>
      </div>

      {/* Progress Bars & Rows */}
      <div className="space-y-4">
        {items.map((item) => {
          const Icon = item.icon;
          const percentage = Math.min(100, Math.round(((item.amount || 0) / baseline) * 100));

          return (
            <div key={item.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg border ${item.lightColor}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-slate-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">({percentage}%)</span>
                  <span className="font-bold text-slate-800">
                    {Number(item.amount).toLocaleString()} {currency}
                  </span>
                </div>
              </div>
              {/* Progress bar container */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default BudgetBreakdown;
