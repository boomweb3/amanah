
import React, { useState } from 'react';
import { DebtStatus } from '../types/types';

export interface Debt {
  id: string;
  creditor: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  category: string;
  notes: string;
  status: DebtStatus;
  createdAt: string;
}

const DebtManagement: React.FC = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    creditor: '',
    amount: '',
    dueDate: '',
    category: 'Personal',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDebt: Debt = {
      id: Math.random().toString(36).substr(2, 9),
      creditor: formData.creditor,
      amount: parseFloat(formData.amount),
      paidAmount: 0,
      dueDate: formData.dueDate,
      category: formData.category,
      notes: formData.notes,
      status: DebtStatus.ACTIVE,
      createdAt: new Date().toISOString()
    };
    setDebts([...debts, newDebt]);
    setShowAddForm(false);
    setFormData({ creditor: '', amount: '', dueDate: '', category: 'Personal', notes: '' });
  };

  const onUpdate = (debt: Debt) => {
    setDebts(debts.map(d => d.id === debt.id ? debt : d));
  };

  const onDelete = (id: string) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  const toggleStatus = (debt: Debt) => {
    onUpdate({
      ...debt,
      status: debt.status === DebtStatus.PAID ? DebtStatus.ACTIVE : DebtStatus.PAID,
      paidAmount: debt.status === DebtStatus.PAID ? 0 : debt.amount
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">My Debts</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-emerald-600 font-semibold hover:underline flex items-center gap-1"
        >
          {showAddForm ? 'Cancel' : '+ Add Record'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-xl shadow-emerald-50 space-y-4 animate-slideDown">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Creditor Name</label>
              <input 
                required
                type="text" 
                value={formData.creditor}
                onChange={(e) => setFormData({...formData, creditor: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="Who do you owe?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400">$</span>
                <input 
                  required
                  type="number" 
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
              <input 
                required
                type="date" 
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              >
                <option value="Personal">Personal Loan</option>
                <option value="Essentials">Essentials/Groceries</option>
                <option value="Business">Business</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
            <textarea 
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              rows={2}
              placeholder="Any specific terms or reminders..."
            />
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
            Save Record
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {debts.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300">
             <i className="fa-solid fa-folder-open text-4xl text-slate-300 mb-4"></i>
             <p className="text-slate-500">No debts recorded yet. Start by adding one above.</p>
          </div>
        ) : (
          debts.map(debt => (
            <div key={debt.id} className={`bg-white p-6 rounded-2xl border ${debt.status === DebtStatus.PAID ? 'border-slate-100 opacity-60' : 'border-slate-200'} shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:shadow-md`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${debt.status === DebtStatus.PAID ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-600'}`}>
                  <i className={debt.status === DebtStatus.PAID ? "fa-solid fa-check" : "fa-solid fa-hourglass-start"}></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{debt.creditor}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-full">{debt.category}</span>
                    <span>Due: {new Date(debt.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="text-right flex-1 md:flex-none">
                  <p className="text-sm text-slate-500 font-medium">Balance</p>
                  <p className="text-xl font-bold text-slate-800">${(debt.amount - debt.paidAmount).toLocaleString()}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleStatus(debt)}
                    className={`p-2 rounded-lg transition-colors ${debt.status === DebtStatus.PAID ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'}`}
                    title={debt.status === DebtStatus.PAID ? "Mark as Active" : "Mark as Paid"}
                  >
                    <i className="fa-solid fa-circle-check text-xl"></i>
                  </button>
                  <button 
                    onClick={() => onDelete(debt.id)}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Record"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DebtManagement;
