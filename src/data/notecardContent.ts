// Notecard content configuration for Craft panel drilldowns

export interface GrindSetting {
  grindSize: string;
  brewMethod: string;
  iconName: 'espresso' | 'aeropress' | 'v60' | 'coldBrewFrenchPress';
}

export interface RecipeField {
  label: string;
  value: string;
  isLink?: boolean;
  linkUrl?: string;
}

// Encore Grind Settings table data - 2 column format
export const ENCORE_GRIND_SETTINGS: GrindSetting[] = [
  {
    grindSize: '07',
    brewMethod: 'Espresso',
    iconName: 'espresso',
  },
  {
    grindSize: '14',
    brewMethod: 'AeroPress',
    iconName: 'aeropress',
  },
  {
    grindSize: '26',
    brewMethod: 'V60',
    iconName: 'v60',
  },
  {
    grindSize: '35',
    brewMethod: 'Cold Brew / French Press',
    iconName: 'coldBrewFrenchPress',
  },
];

// V60 Recipe fields
export const V60_RECIPE: RecipeField[] = [
  {
    label: 'Ratio',
    value: '1:15',
  },
  {
    label: 'Water',
    value: '1000g filtered water',
  },
  {
    label: 'Coffee',
    value: '66g @ 26 grind setting',
  },
  {
    label: 'Method',
    value: 'Tetsu Kasuya V60 Brewing Technique',
    isLink: true,
    linkUrl: 'https://www.youtube.com/watch?v=wmCW8xSWGZY',
  },
];

// Brew method icons for the table
export const BREW_METHOD_ICONS = {
  espresso: '/espresso_machine.webp',
  aeropress: '/aeropress.webp',
  v60: '/pourover.webp',
  coldBrewFrenchPress: '/french_press.webp',
};
