import type { Recipe } from '../../../shared/types';

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Classic Margherita Pizza',
    description: 'A simple and delicious pizza with tomato, mozzarella, and basil',
    ingredients: [
      { id: '1', name: 'Pizza dough', amount: 1, unit: 'piece' },
      { id: '2', name: 'Tomato sauce', amount: 200, unit: 'ml' },
      { id: '3', name: 'Mozzarella', amount: 150, unit: 'g' },
      { id: '4', name: 'Fresh basil', amount: 10, unit: 'leaves' }
    ],
    instructions: [
      'Preheat oven to 250°C',
      'Roll out pizza dough',
      'Spread tomato sauce',
      'Add mozzarella and basil',
      'Bake for 10-12 minutes'
    ],
    prepTime: 15,
    cookTime: 12,
    servings: 2,
    difficulty: 'easy',
    tags: ['italian', 'vegetarian', 'pizza'],
    userId: 'user1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Chocolate Chip Cookies',
    description: 'Soft and chewy homemade chocolate chip cookies',
    ingredients: [
      { id: '5', name: 'All-purpose flour', amount: 2.25, unit: 'cups' },
      { id: '6', name: 'Butter', amount: 226, unit: 'g' },
      { id: '7', name: 'Brown sugar', amount: 150, unit: 'g' },
      { id: '8', name: 'Chocolate chips', amount: 200, unit: 'g' }
    ],
    instructions: [
      'Cream butter and sugars',
      'Mix in flour gradually',
      'Fold in chocolate chips',
      'Bake at 190°C for 9-11 minutes'
    ],
    prepTime: 15,
    cookTime: 11,
    servings: 24,
    difficulty: 'easy',
    tags: ['dessert', 'cookies', 'chocolate'],
    userId: 'user1',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  }
];