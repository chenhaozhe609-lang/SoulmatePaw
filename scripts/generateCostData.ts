import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { CostData } from '../src/types/calculator';

// Load environment variables
dotenv.config({ path: '.env.local' });

const API_KEY = process.env.DEEPSEEK_API_KEY;

if (!API_KEY) {
  console.error('Error: DEEPSEEK_API_KEY is not set in .env file.');
  process.exit(1);
}

// Initialize DeepSeek client
const openai = new OpenAI({
  apiKey: API_KEY,
  baseURL: 'https://api.deepseek.com',
});

const OUTPUT_PATH = path.join(process.cwd(), 'src', 'constants', 'generatedCostData.json');

const SYSTEM_PROMPT = `
You are a Veterinary Economist in the US.
Your task is to generate realistic 2025 cost estimates for pet ownership in the US market.
You need to cover 4 pet sizes: 'cat', 'small_dog', 'medium_dog', 'large_dog'.
You need to cover 3 budget levels: 'budget', 'standard', 'premium'.

For each combination of Pet Size and Budget Level, provide:
1. One-time costs (e.g., initial supplies, adoption fees, spay/neuter, microchip).
2. Monthly costs (e.g., food, insurance, toys, flea/tick prevention).

Each cost item must include:
- id: a unique string identifier (kebab-case).
- label: a display name.
- amount: estimated cost in USD (number).
- amazonKeyword: a specific search keyword for Amazon (e.g., "Friskies dry cat food" for budget cat, "Orijen cat food" for premium cat).

The output must be a valid JSON object matching this TypeScript structure:
Record<PetSize, Record<BudgetLevel, { oneTime: CostItem[], monthly: CostItem[] }>>

Where:
PetSize = 'cat' | 'small_dog' | 'medium_dog' | 'large_dog'
BudgetLevel = 'budget' | 'standard' | 'premium'

Example structure snippet:
{
  "cat": {
    "budget": {
      "oneTime": [{ "id": "litter-box", "label": "Basic Litter Box", "amount": 15, "amazonKeyword": "basic cat litter pan" }],
      "monthly": [{ "id": "dry-food", "label": "Economy Dry Food", "amount": 20, "amazonKeyword": "Friskies dry cat food" }]
    },
    ...
  },
  ...
}

Return ONLY the JSON object. No markdown formatting, no explanations.
`;

async function generateCostData() {
  console.log('Generating cost data using DeepSeek API...');

  try {
    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: 'Generate the 2025 US pet market cost data now.' },
      ],
      temperature: 0.7,
      max_tokens: 8000,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content;

    if (!content) {
      throw new Error('Received empty response from DeepSeek API.');
    }

    // Parse and validate JSON
    let costData: CostData;
    try {
      costData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', content);
      throw new Error('Invalid JSON received from API.');
    }

    // Basic validation check (optional, but good practice)
    if (!costData.cat || !costData.small_dog) {
        console.warn('Warning: Generated data might be incomplete. Check the output file.');
    }

    // Ensure directory exists
    const dir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write to file
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(costData, null, 2));
    console.log(`Success! Cost data saved to ${OUTPUT_PATH}`);

  } catch (error) {
    console.error('Error generating cost data:', error);
    process.exit(1);
  }
}

generateCostData();
