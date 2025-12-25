'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  PawPrint, 
  DollarSign, 
  Wallet, 
  Info,
  ChevronDown,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { useCostCalculator } from '@/hooks/useCostCalculator';
import { PetSize, BudgetLevel } from '@/types/calculator';

// --- Theme Colors ---
const COLORS = [
  '#8DA399', // Sage Green (Brand)
  '#A3B8AD', // Light Sage
  '#E6D5B8', // Sand
  '#D4C5A9', // Dark Sand
  '#94A3B8', // Slate Blue
  '#64748B', // Dark Slate
];

const SIZE_OPTIONS: { value: PetSize; label: string }[] = [
  { value: 'cat', label: 'Cat' },
  { value: 'small_dog', label: 'Small Dog' },
  { value: 'medium_dog', label: 'Medium Dog' },
  { value: 'large_dog', label: 'Large Dog' },
];

const BUDGET_OPTIONS: { value: BudgetLevel; label: string }[] = [
  { value: 'budget', label: 'Budget' },
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
];

// --- Helper: Categorize Item Type ---
const getItemCategory = (label: string): 'service' | 'high-value' | 'product' => {
  const lowerLabel = label.toLowerCase();
  
  // 1. Services (No Links)
  if (
    lowerLabel.includes('adoption') ||
    lowerLabel.includes('fee') ||
    lowerLabel.includes('vet') ||
    lowerLabel.includes('spay') ||
    lowerLabel.includes('neuter') ||
    lowerLabel.includes('microchip') ||
    lowerLabel.includes('insurance') ||
    lowerLabel.includes('registration')
  ) {
    return 'service';
  }

  // 2. High-Value Products (Highlight)
  if (
    lowerLabel.includes('food') ||
    lowerLabel.includes('crate') ||
    lowerLabel.includes('tower') ||
    lowerLabel.includes('carrier') ||
    lowerLabel.includes('bed')
  ) {
    return 'high-value';
  }

  // 3. Standard Products
  return 'product';
};

// --- Helper: Generate Amazon Affiliate Link ---
const getAmazonLink = (keyword: string) => {
  const tag = 'soulmatepaw01-20';
  const encodedKeyword = encodeURIComponent(keyword);
  return `https://www.amazon.com/s?k=${encodedKeyword}&tag=${tag}`;
};

export default function CostCalculator() {
  const searchParams = useSearchParams();
  
  const {
    selectedSize,
    setSelectedSize,
    selectedBudget,
    setSelectedBudget,
    currentBreakdown,
    oneTimeTotal,
    monthlyTotal,
    firstYearTotal,
  } = useCostCalculator();

  // --- Auto-Select based on URL Params ---
  useEffect(() => {
    const sizeParam = searchParams.get('size');
    if (sizeParam) {
      // Map 'small', 'medium', 'large' to our specific keys if needed, 
      // or assume direct match if keys align.
      // Our keys: 'cat', 'small_dog', 'medium_dog', 'large_dog'
      
      // Handle generic "small", "medium", "large" mapping to dog by default if not specified
      let mappedSize: PetSize | null = null;
      
      if (['small_dog', 'medium_dog', 'large_dog', 'cat'].includes(sizeParam)) {
        mappedSize = sizeParam as PetSize;
      } else if (sizeParam === 'small') mappedSize = 'small_dog';
      else if (sizeParam === 'medium') mappedSize = 'medium_dog';
      else if (sizeParam === 'large') mappedSize = 'large_dog';

      if (mappedSize) {
        setSelectedSize(mappedSize);
      }
    }
  }, [searchParams, setSelectedSize]);

  // Prepare Data for Chart
  const chartData = currentBreakdown.monthly.map((item) => ({
    name: item.label,
    value: item.amount,
  }));

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 text-sm">
          <p className="font-semibold text-gray-700">{payload[0].name}</p>
          <p className="text-[#8DA399] font-bold">
            ${payload[0].value} <span className="text-gray-400 font-normal">/ mo</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // --- Helper: Render List Item with Smart Logic ---
  const renderCostItem = (item: any) => {
    const category = getItemCategory(item.label);
    const hasLink = category !== 'service' && item.amazonKeyword;

    return (
      <li key={item.id} className="flex items-center justify-between group py-3 border-b border-dashed border-gray-100 last:border-0">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm group-hover:text-gray-900 transition-colors">
            {item.label}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Action Button Logic */}
          {hasLink && (
            <>
              {/* Case B: High Value (Prominent Shop Button) */}
              {category === 'high-value' && (
                <a
                  href={getAmazonLink(item.amazonKeyword)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-[#8DA399]/10 text-[#8DA399] px-3 py-1.5 rounded-full text-xs font-bold hover:bg-[#8DA399] hover:text-white transition-all transform hover:scale-105"
                >
                  <ShoppingBag size={12} />
                  Shop
                </a>
              )}

              {/* Case C: Standard Product (Subtle Icon) */}
              {category === 'product' && (
                <a
                  href={getAmazonLink(item.amazonKeyword)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-300 hover:text-[#8DA399] hover:bg-gray-50 rounded-full transition-all"
                  title={`Shop for ${item.label}`}
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </>
          )}

          <span className="font-medium text-gray-800 text-sm w-16 text-right">
            ${item.amount}
          </span>
        </div>
      </li>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      
      {/* --- 1. Control Panel --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        
        {/* Pet Size Selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <PawPrint className="w-4 h-4" />
            Select Pet Size
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SIZE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedSize(option.value)}
                className={`
                  relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  flex flex-col items-center justify-center gap-2
                  ${selectedSize === option.value 
                    ? 'bg-[#8DA399] text-white shadow-md transform scale-105' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:scale-102'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Lifestyle / Budget
          </label>
          <div className="flex p-1 bg-gray-100 rounded-full">
            {BUDGET_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedBudget(option.value)}
                className={`
                  flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300
                  ${selectedBudget === option.value 
                    ? 'bg-white text-[#8DA399] shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- 2. Dashboard (Split View) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Big Numbers */}
        <div className="bg-[#8DA399]/10 rounded-3xl p-8 flex flex-col justify-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <DollarSign className="w-32 h-32 text-[#8DA399]" />
          </div>

          {/* First Year Total */}
          <div className="relative z-10">
            <p className="text-[#8DA399] font-medium text-lg mb-1">First Year Total</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight">
                $
                <CountUp value={firstYearTotal} />
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Includes one-time setup costs + 12 months of recurring expenses.
            </p>
          </div>

          <div className="w-full h-px bg-[#8DA399]/20" />

          {/* Monthly Average */}
          <div className="relative z-10">
            <p className="text-[#8DA399] font-medium text-lg mb-1">Monthly Average</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
                $
                <CountUp value={monthlyTotal} />
              </span>
              <span className="text-gray-500 font-medium">/mo</span>
            </div>
          </div>
        </div>

        {/* Right: Visualization (Donut Chart) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center min-h-[350px]">
           <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider mb-4 w-full text-left">
             Monthly Breakdown
           </h3>
           <div className="w-full h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={chartData}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {chartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip content={<CustomTooltip />} />
                 <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-xs text-gray-600 ml-1">{value}</span>}
                 />
               </PieChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* --- 3. Detailed Breakdown --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Info className="w-5 h-5 text-[#8DA399]" />
            Where does the money go?
          </h3>
          <span className="text-xs text-gray-400 font-medium bg-white px-3 py-1 rounded-full border border-gray-100">
            2025 Market Estimates
          </span>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* One-Time Costs */}
          <div>
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              One-Time Setup
            </h4>
            <ul className="space-y-3">
              {currentBreakdown.oneTime.map((item) => renderCostItem(item))}
              <li className="flex items-center justify-between pt-3 mt-2 border-t border-dashed border-gray-200">
                <span className="text-gray-500 font-medium text-sm">Subtotal</span>
                <span className="text-[#8DA399] font-bold text-sm">${oneTimeTotal}</span>
              </li>
            </ul>
          </div>

          {/* Monthly Costs */}
          <div>
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              Monthly Recurring
            </h4>
            <ul className="space-y-3">
              {currentBreakdown.monthly.map((item) => renderCostItem(item))}
              <li className="flex items-center justify-between pt-3 mt-2 border-t border-dashed border-gray-200">
                <span className="text-gray-500 font-medium text-sm">Subtotal</span>
                <span className="text-[#8DA399] font-bold text-sm">${monthlyTotal} / mo</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
}

// --- Helper Component for Animated Numbers ---
function CountUp({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    // Simple lerp animation for numbers
    let start = displayValue;
    const end = value;
    if (start === end) return;

    const duration = 1000; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutQuart)
      const ease = 1 - Math.pow(1 - progress, 4);
      
      const nextValue = Math.floor(start + (end - start) * ease);
      setDisplayValue(nextValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <>{displayValue.toLocaleString()}</>;
}
