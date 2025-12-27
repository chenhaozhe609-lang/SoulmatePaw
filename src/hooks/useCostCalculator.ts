import { useState, useMemo, useEffect } from 'react';
import { PetSize, BudgetLevel, CostData } from '@/types/calculator';
import rawCostData from '@/constants/generatedCostData.json';

// Cast the raw JSON to the strict CostData type to ensure type safety
const costData = rawCostData as unknown as CostData;

export function useCostCalculator(initialSize: PetSize = 'medium_dog') {
  // State Management
  const [selectedSize, setSelectedSize] = useState<PetSize>(initialSize);
  const [selectedBudget, setSelectedBudget] = useState<BudgetLevel>('standard');

  // Calculation Logic
  const calculationResult = useMemo(() => {
    // Retrieve specific data node based on current selection
    const currentBreakdown = costData[selectedSize][selectedBudget];

    // Calculate totals
    const oneTimeTotal = currentBreakdown.oneTime.reduce((sum, item) => sum + item.amount, 0);
    const monthlyTotal = currentBreakdown.monthly.reduce((sum, item) => sum + item.amount, 0);
    const annualTotal = monthlyTotal * 12;
    const firstYearTotal = oneTimeTotal + annualTotal;

    return {
      currentBreakdown,
      oneTimeTotal,
      monthlyTotal,
      annualTotal,
      firstYearTotal
    };
  }, [selectedSize, selectedBudget]);

  // Logging for verification
  useEffect(() => {
    console.log(
      `Calculator Updated: Size=${selectedSize}, Budget=${selectedBudget}, Monthly=$${calculationResult.monthlyTotal}`
    );
  }, [selectedSize, selectedBudget, calculationResult.monthlyTotal]);

  // Return values
  return {
    selectedSize,
    setSelectedSize,
    selectedBudget,
    setSelectedBudget,
    ...calculationResult
  };
}
