export type PetSize = 'cat' | 'small_dog' | 'medium_dog' | 'large_dog';

export type BudgetLevel = 'budget' | 'standard' | 'premium';

export interface CostItem {
  id: string;
  label: string; // Display name, e.g., "High-Protein Kibble"
  amount: number; // Estimated cost in USD
  amazonKeyword: string; // Specific keyword for affiliate search
}

export type CostData = Record<
  PetSize,
  Record<
    BudgetLevel,
    {
      oneTime: CostItem[];
      monthly: CostItem[];
    }
  >
>;
