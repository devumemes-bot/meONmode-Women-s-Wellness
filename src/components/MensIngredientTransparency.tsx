import React from 'react';
import { IngredientTransparency } from './IngredientTransparency';
import { MEN_TRANSPARENCY_HERBS } from '../ingredientData';

/**
 * MensIngredientTransparency
 * Uses the exact same UI/UX, visual hierarchy, expandable interaction,
 * cards, cream background, typography, and responsive behavior as the Women's version.
 * Populated strictly with verified ALPHAMAX and WANTMORE ingredients.
 */
export const MensIngredientTransparency: React.FC = () => {
  return (
    <IngredientTransparency 
      category="men" 
      ingredients={MEN_TRANSPARENCY_HERBS} 
    />
  );
};
