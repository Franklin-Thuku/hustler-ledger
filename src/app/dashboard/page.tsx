"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Users, AlertCircle, Plus, Search, Filter, Download, Bell, Calendar, Target, Wallet, ArrowUpRight, ArrowDownRight, Check, X, Menu, Home, PieChartIcon, FileText, Settings } from "lucide-react";
import { getTransactions, getMockDebts, getMockBudgets, getMockNotifications, requireBusiness } from '@/lib/auth-wrapper'
import { format, subDays, startOfDay, endOfDay, isWithinInterval, parseISO } from "date-fns";

interface Transaction {
  id: string;
  type: 'sale' | 'expense' | 'credit' | 'repayment';
  amount: number;
  category: string;
  description: string;
  customer?: string;
  timestamp: string;
}

interface Debt {
  id: string;
  customer: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
}

interface Budget {
  category: string;
  limit: number;
  spent: number;
}

interface Notification {
  id: string;
  type: 'warning' | 'success' | 'error';
  message: string;
  timestamp: string;
  read: boolean;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'analytics' | 'debts' | 'budget'>('overview');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        // In development, we'll use mock data
        const mockTransactions = await getTransactions('mock-business-id', 50);
        setTransactions(mockTransactions);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Mock data - in production, this would come from API
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'sale', amount: 2500, category: 'Vegetables', description: 'Tomatoes and onions', customer: 'John Doe', timestamp: new Date().toISOString() },
    { id: '2', type: 'expense', amount: 800, category: 'Transport', description: 'Market transport', timestamp: subDays(new Date(), 1).toISOString() },
    { id: '3', type: 'credit', amount: 1500, category: 'Vegetables', description: 'Credit sale', customer: 'Jane Smith', timestamp: subDays(new Date(), 2).toISOString() },
    { id: '4', type: 'repayment', amount: 500, category: 'Credit Collection', description: 'Partial payment', customer: 'Bob Johnson', timestamp: subDays(new Date(), 3).toISOString() },
  ]);

  const [debts] = useState(getMockDebts());
  const [budgets] = useState(getMockBudgets());
  const [notifications] = useState(getMockNotifications());

  // Calculate metrics based on time range
  const metrics = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case 'today':
        startDate = startOfDay(now);
        break;
      case 'week':
        startDate = subDays(now, 7);
        break;
      case 'month':
        startDate = subDays(now, 30);
        break;
    }

    const filteredTransactions = transactions.filter(t => 
      isWithinInterval(parseISO(t.timestamp), { start: startDate, end: endOfDay(now) })
    );

    const revenue = filteredTransactions
      .filter(t => t.type === 'sale' || t.type === 'repayment')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netProfit = revenue - expenses;
    const creditGiven = filteredTransactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalDebt = debts.reduce((sum, d) => sum + d.amount, 0);
    const cashBalance = 5000 + netProfit - creditGiven; // Mock starting balance

    return {
      revenue,
      expenses,
      netProfit,
      cashBalance,
      creditGiven,
      totalDebt
    };
  }, [transactions, debts, timeRange]);

  // Chart data
  const revenueVsExpensesData = useMemo(() => {
    const days = timeRange === 'today' ? 1 : timeRange === 'week' ? 7 : 30;
    return Array.from({ length: Math.min(days, 7) }, (_, i) => ({
      date: format(subDays(new Date(), days - 1 - i), 'MMM dd'),
      revenue: Math.floor(Math.random() * 3000) + 1000,
      expenses: Math.floor(Math.random() * 1500) + 500,
    })).reverse();
  }, [timeRange]);

  const expenseBreakdownData = useMemo(() => {
    const categories: { [key: string]: number } = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const topProductsData = useMemo(() => [
    { name: 'Tomatoes', sales: 8500 },
    { name: 'Onions', sales: 6200 },
    { name: 'Peppers', sales: 4100 },
    { name: 'Cabbage', sales: 3800 },
    { name: 'Carrots', sales: 2900 },
  ], []);

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'];

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           t.customer?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [transactions, searchQuery, filterType]);

  return (
    <div className="min-h-screen bg-[#060807] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#060807]/95 backdrop-blur-md border-b border-white/10">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-black italic uppercase tracking-tighter">MAMA MBOGA</h1>
              <p className="text-[10px] font-black text-green-400 tracking-[0.3em] uppercase">Verified Identity</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <div className="hidden sm:flex bg-white/5 rounded-lg p-1">
              {(['today', 'week', 'month'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                    timeRange === range ? 'bg-green-500 text-black' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-xl max-h-96 overflow-y-auto"
                  >
                    <div className="p-4 border-b border-white/10">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="divide-y divide-white/10">
                      {notifications.map((notif) => (
                        <div key={notif.id} className={`p-4 ${!notif.read ? 'bg-white/5' : ''}`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notif.type === 'warning' ? 'bg-yellow-500' :
                              notif.type === 'error' ? 'bg-red-500' : 'bg-green-500'
                            }`} />
                            <div className="flex-1">
                              <p className="text-sm">{notif.message}</p>
                              <p className="text-xs text-white/50 mt-1">
                                {format(parseISO(notif.timestamp), 'MMM dd, HH:mm')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-black">MM</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Navigation Tabs */}
      <div className="sticky top-16 z-30 bg-[#060807]/95 backdrop-blur-md border-b border-white/10">
        <div className="px-4 py-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', label: 'Overview', icon: Home },
              { id: 'transactions', label: 'Transactions', icon: FileText },
              { id: 'analytics', label: 'Analytics', icon: PieChartIcon },
              { id: 'debts', label: 'Debts', icon: Users },
              { id: 'budget', label: 'Budget', icon: Target },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-green-500 text-black'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 py-6 pb-24">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {[
                { label: 'Revenue', value: metrics.revenue, change: 12, icon: TrendingUp, color: 'text-green-400' },
                { label: 'Expenses', value: metrics.expenses, change: -8, icon: TrendingDown, color: 'text-red-400' },
                { label: 'Net Profit', value: metrics.netProfit, change: 15, icon: DollarSign, color: 'text-blue-400' },
                { label: 'Cash Balance', value: metrics.cashBalance, change: 5, icon: Wallet, color: 'text-purple-400' },
                { label: 'Credit Given', value: metrics.creditGiven, change: -3, icon: CreditCard, color: 'text-yellow-400' },
                { label: 'Debt Owed', value: metrics.totalDebt, change: 0, icon: Users, color: 'text-orange-400' },
              ].map((kpi, index) => (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                    <span className={`text-xs font-medium flex items-center gap-1 ${
                      kpi.change > 0 ? 'text-green-400' : kpi.change < 0 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {kpi.change > 0 ? <ArrowUpRight className="w-3 h-3" /> : kpi.change < 0 ? <ArrowDownRight className="w-3 h-3" /> : null}
                      {Math.abs(kpi.change)}%
                    </span>
                  </div>
                  <p className="text-xs text-white/50 mb-1">{kpi.label}</p>
                  <p className="text-lg font-bold">KES {kpi.value.toLocaleString()}</p>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="bg-green-500 text-black p-4 rounded-xl font-semibold hover:bg-green-400 transition-colors">
                <Plus className="w-5 h-5 mb-2" />
                Add Sale
              </button>
              <button className="bg-white/10 p-4 rounded-xl font-semibold hover:bg-white/20 transition-colors">
                <CreditCard className="w-5 h-5 mb-2" />
                Record Expense
              </button>
              <button className="bg-white/10 p-4 rounded-xl font-semibold hover:bg-white/20 transition-colors">
                <Users className="w-5 h-5 mb-2" />
                Manage Debt
              </button>
              <button className="bg-white/10 p-4 rounded-xl font-semibold hover:bg-white/20 transition-colors">
                <Download className="w-5 h-5 mb-2" />
                Export Report
              </button>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="font-semibold mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        transaction.type === 'sale' ? 'bg-green-400' :
                        transaction.type === 'expense' ? 'bg-red-400' :
                        transaction.type === 'credit' ? 'bg-yellow-400' : 'bg-blue-400'
                      }`} />
                      <div>
                        <p className="text-sm font-medium">{transaction.description}</p>
                        <p className="text-xs text-white/50">
                          {transaction.customer && `${transaction.customer} • `}
                          {format(parseISO(transaction.timestamp), 'MMM dd, HH:mm')}
                        </p>
                      </div>
                    </div>
                    <p className={`font-semibold ${
                      transaction.type === 'sale' || transaction.type === 'repayment' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'sale' || transaction.type === 'repayment' ? '+' : '-'}KES {transaction.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white placeholder-white/50"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white"
              >
                <option value="all">All Types</option>
                <option value="sale">Sales</option>
                <option value="expense">Expenses</option>
                <option value="credit">Credit</option>
                <option value="repayment">Repayments</option>
              </select>
            </div>

            {/* Transactions List */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="divide-y divide-white/10">
                {filteredTransactions.map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          transaction.type === 'sale' ? 'bg-green-400' :
                          transaction.type === 'expense' ? 'bg-red-400' :
                          transaction.type === 'credit' ? 'bg-yellow-400' : 'bg-blue-400'
                        }`} />
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-white/50">
                            {transaction.customer && `${transaction.customer} • `}
                            {transaction.category} • {format(parseISO(transaction.timestamp), 'MMM dd, HH:mm')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${
                          transaction.type === 'sale' || transaction.type === 'repayment' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'sale' || transaction.type === 'repayment' ? '+' : '-'}KES {transaction.amount}
                        </p>
                        <p className="text-xs text-white/50 capitalize">{transaction.type}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue vs Expenses Chart */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 lg:col-span-2">
                <h3 className="font-semibold mb-4">Revenue vs Expenses</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={revenueVsExpensesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)' }}
                      labelStyle={{ color: 'white' }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Expense Breakdown */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="font-semibold mb-4">Expense Breakdown</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={expenseBreakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {expenseBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)' }}
                      labelStyle={{ color: 'white' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Top Products */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="font-semibold mb-4">Top Selling Products</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={topProductsData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                    <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)' }}
                      labelStyle={{ color: 'white' }}
                    />
                    <Bar dataKey="sales" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {/* Debts Tab */}
        {activeTab === 'debts' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <p className="text-sm text-green-400 mb-1">0-30 Days</p>
                <p className="text-2xl font-bold">KES 1,500</p>
                <p className="text-xs text-white/50">1 customer</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <p className="text-sm text-yellow-400 mb-1">31-60 Days</p>
                <p className="text-2xl font-bold">KES 2,200</p>
                <p className="text-xs text-white/50">1 customer</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-sm text-red-400 mb-1">60+ Days</p>
                <p className="text-2xl font-bold">KES 800</p>
                <p className="text-xs text-white/50">1 customer</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h3 className="font-semibold">Outstanding Debts</h3>
              </div>
              <div className="divide-y divide-white/10">
                {debts.map((debt) => (
                  <motion.div
                    key={debt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          debt.daysOverdue > 60 ? 'bg-red-400' :
                          debt.daysOverdue > 30 ? 'bg-yellow-400' : 'bg-green-400'
                        }`} />
                        <div>
                          <p className="font-medium">{debt.customer}</p>
                          <p className="text-sm text-white/50">
                            Due: {format(parseISO(debt.dueDate), 'MMM dd, yyyy')} • {debt.daysOverdue} days overdue
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-bold">KES {debt.amount}</p>
                        <button className="px-3 py-1 bg-green-500 text-black text-sm rounded-lg hover:bg-green-400 transition-colors">
                          Mark Paid
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Budget Tab */}
        {activeTab === 'budget' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="font-semibold mb-4">Monthly Budget Overview</h3>
              <div className="space-y-4">
                {budgets.map((budget) => {
                  const percentage = (budget.spent / budget.limit) * 100;
                  const isOverBudget = percentage > 100;
                  const isNearLimit = percentage > 80;
                  
                  return (
                    <div key={budget.category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{budget.category}</span>
                        <span className={`text-sm ${isOverBudget ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-green-400'}`}>
                          KES {budget.spent} / KES {budget.limit}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isOverBudget ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-white/50">
                        {percentage.toFixed(1)}% used • KES {budget.limit - budget.spent} remaining
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="font-semibold mb-4">Savings Goals</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Emergency Fund</span>
                    <span className="text-sm text-green-400">KES 15,000 / KES 50,000</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }} />
                  </div>
                  <p className="text-xs text-white/50">30% complete • On track for Dec 2025</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">New Equipment</span>
                    <span className="text-sm text-blue-400">KES 8,000 / KES 25,000</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '32%' }} />
                  </div>
                  <p className="text-xs text-white/50">32% complete • On track for Mar 2025</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowAddTransaction(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 text-black rounded-full shadow-lg flex items-center justify-center z-50"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {showAddTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowAddTransaction(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-[#060807] border border-white/20 rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add Transaction</h3>
                <button
                  onClick={() => setShowAddTransaction(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white">
                    <option value="sale">Sale</option>
                    <option value="expense">Expense</option>
                    <option value="credit">Credit</option>
                    <option value="repayment">Repayment</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (KES)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white placeholder-white/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <input
                    type="text"
                    placeholder="Enter description"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white placeholder-white/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <input
                    type="text"
                    placeholder="e.g., Vegetables, Transport"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white placeholder-white/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Customer (Optional)</label>
                  <input
                    type="text"
                    placeholder="Customer name"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white placeholder-white/50"
                  />
                </div>
                
                <button className="w-full bg-green-500 text-black py-3 rounded-lg font-semibold hover:bg-green-400 transition-colors">
                  Add Transaction
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
