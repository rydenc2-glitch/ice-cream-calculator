import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator, ChefHat, Info, RefreshCw, Sparkles } from 'lucide-react';

export default function WhynterIceCreamCalculator() {
  const [mode, setMode] = useState('scale'); // 'scale' or 'pantry'
  
  // Mode 1: Scale Recipe
  const [customIngredients, setCustomIngredients] = useState([
    { id: 1, name: 'Heavy Cream', amount: 2, unit: 'cups' },
    { id: 2, name: 'Whole Milk', amount: 1, unit: 'cup' },
    { id: 3, name: 'Sugar', amount: 0.75, unit: 'cup' },
    { id: 4, name: 'Vanilla Extract', amount: 2, unit: 'tsp' }
  ]);
  const [baseYield, setBaseYield] = useState(1.5);
  
  // Mode 2: Check Pantry
  const [availableIngredients, setAvailableIngredients] = useState([
    { id: 1, name: 'Heavy Cream', amount: 4, unit: 'cups' },
    { id: 2, name: 'Whole Milk', amount: 2, unit: 'cups' },
    { id: 3, name: 'Sugar', amount: 2, unit: 'cups' },
    { id: 4, name: 'Vanilla Extract', amount: 4, unit: 'tsp' }
  ]);
  
  const [selectedModel, setSelectedModel] = useState('2.1qt');
  const [selectedFlavor, setSelectedFlavor] = useState('vanilla');
  const [scaledRecipe, setScaledRecipe] = useState([]);
  const [canMake, setCanMake] = useState(true);
  const [missingIngredients, setMissingIngredients] = useState([]);
  
  const whynterModels = {
    '0.8qt': { name: '0.8 Qt Compact (ICM-080)', optimal: 0.7, max: 0.8 },
    '1.28qt': { name: '1.28 Qt Compact (ICM-128WS)', optimal: 1.1, max: 1.28 },
    '1.6qt': { name: '1.6 Qt (ICM-15LS)', optimal: 1.4, max: 1.6 },
    '2qt': { name: '2 Qt (ICM-220)', optimal: 1.75, max: 2 },
    '2.1qt': { name: '2.1 Qt (ICM-200LS/201SB)', optimal: 1.85, max: 2.1 },
    '2.6qt': { name: '2.6 Qt Upright (ICM-255SSY)', optimal: 2.3, max: 2.6 }
  };

  const presetRecipes = {
    vanilla: {
      name: 'Classic Vanilla',
      baseYield: 1.5,
      ingredients: [
        { name: 'Heavy Cream', amount: 2, unit: 'cups' },
        { name: 'Whole Milk', amount: 1, unit: 'cup' },
        { name: 'Sugar', amount: 0.75, unit: 'cup' },
        { name: 'Vanilla Extract', amount: 2, unit: 'tsp' },
        { name: 'Salt', amount: 0.25, unit: 'tsp' }
      ]
    },
    chocolate: {
      name: 'Rich Chocolate',
      baseYield: 1.5,
      ingredients: [
        { name: 'Heavy Cream', amount: 2, unit: 'cups' },
        { name: 'Whole Milk', amount: 1, unit: 'cup' },
        { name: 'Sugar', amount: 0.75, unit: 'cup' },
        { name: 'Cocoa Powder', amount: 0.5, unit: 'cup' },
        { name: 'Vanilla Extract', amount: 1, unit: 'tsp' }
      ]
    },
    strawberry: {
      name: 'Fresh Strawberry',
      baseYield: 1.5,
      ingredients: [
        { name: 'Heavy Cream', amount: 1.5, unit: 'cups' },
        { name: 'Whole Milk', amount: 1, unit: 'cup' },
        { name: 'Sugar', amount: 0.75, unit: 'cup' },
        { name: 'Fresh Strawberries', amount: 1.5, unit: 'cups' },
        { name: 'Lemon Juice', amount: 1, unit: 'tbsp' }
      ]
    },
    mintchip: {
      name: 'Mint Chocolate Chip',
      baseYield: 1.5,
      ingredients: [
        { name: 'Heavy Cream', amount: 2, unit: 'cups' },
        { name: 'Whole Milk', amount: 1, unit: 'cup' },
        { name: 'Sugar', amount: 0.75, unit: 'cup' },
        { name: 'Peppermint Extract', amount: 1.5, unit: 'tsp' },
        { name: 'Chocolate Chips', amount: 0.75, unit: 'cup' },
        { name: 'Green Food Coloring', amount: 3, unit: 'drops' }
      ]
    },
    cookiescream: {
      name: 'Cookies & Cream',
      baseYield: 1.5,
      ingredients: [
        { name: 'Heavy Cream', amount: 2, unit: 'cups' },
        { name: 'Whole Milk', amount: 1, unit: 'cup' },
        { name: 'Sugar', amount: 0.75, unit: 'cup' },
        { name: 'Vanilla Extract', amount: 2, unit: 'tsp' },
        { name: 'Crushed Oreos', amount: 1, unit: 'cup' }
      ]
    },
    coffee: {
      name: 'Coffee Ice Cream',
      baseYield: 1.5,
      ingredients: [
        { name: 'Heavy Cream', amount: 2, unit: 'cups' },
        { name: 'Whole Milk', amount: 1, unit: 'cup' },
        { name: 'Sugar', amount: 0.75, unit: 'cup' },
        { name: 'Instant Coffee', amount: 3, unit: 'tbsp' },
        { name: 'Vanilla Extract', amount: 1, unit: 'tsp' }
      ]
    },
    pistachio: {
      name: 'Pistachio',
      baseYield: 1.5,
      ingredients: [
        { name: 'Heavy Cream', amount: 2, unit: 'cups' },
        { name: 'Whole Milk', amount: 1, unit: 'cup' },
        { name: 'Sugar', amount: 0.75, unit: 'cup' },
        { name: 'Pistachio Paste', amount: 0.5, unit: 'cup' },
        { name: 'Almond Extract', amount: 0.5, unit: 'tsp' }
      ]
    },
    salted_caramel: {
      name: 'Salted Caramel',
      baseYield: 1.5,
      ingredients: [
        { name: 'Heavy Cream', amount: 2, unit: 'cups' },
        { name: 'Whole Milk', amount: 1, unit: 'cup' },
        { name: 'Sugar', amount: 0.75, unit: 'cup' },
        { name: 'Caramel Sauce', amount: 0.75, unit: 'cup' },
        { name: 'Sea Salt', amount: 0.5, unit: 'tsp' }
      ]
    },
    rocky_road: {
      name: 'Rocky Road',
      baseYield: 1.5,
      ingredients: [
        { name: 'Heavy Cream', amount: 2, unit: 'cups' },
        { name: 'Whole Milk', amount: 1, unit: 'cup' },
        { name: 'Sugar', amount: 0.75, unit: 'cup' },
        { name: 'Cocoa Powder', amount: 0.5, unit: 'cup' },
        { name: 'Mini Marshmallows', amount: 1, unit: 'cup' },
        { name: 'Chopped Almonds', amount: 0.5, unit: 'cup' },
        { name: 'Chocolate Chips', amount: 0.5, unit: 'cup' }
      ]
    },
    mango: {
      name: 'Mango Sorbet',
      baseYield: 1.5,
      ingredients: [
        { name: 'Mango Puree', amount: 3, unit: 'cups' },
        { name: 'Sugar', amount: 0.75, unit: 'cup' },
        { name: 'Water', amount: 0.5, unit: 'cup' },
        { name: 'Lime Juice', amount: 2, unit: 'tbsp' }
      ]
    },
    peach: {
      name: 'Peach Ice Cream',
      baseYield: 1.5,
      ingredients: [
        { name: 'Heavy Cream', amount: 2, unit: 'cups' },
        { name: 'Whole Milk', amount: 1, unit: 'cup' },
        { name: 'Sugar', amount: 0.75, unit: 'cup' },
        { name: 'Fresh Peaches', amount: 2, unit: 'cups' },
        { name: 'Lemon Juice', amount: 1, unit: 'tbsp' }
      ]
    },
    peanutbutter: {
      name: 'Peanut Butter',
      baseYield: 1.5,
      ingredients: [
        { name: 'Heavy Cream', amount: 2, unit: 'cups' },
        { name: 'Whole Milk', amount: 1, unit: 'cup' },
        { name: 'Sugar', amount: 0.75, unit: 'cup' },
        { name: 'Peanut Butter', amount: 0.75, unit: 'cup' },
        { name: 'Vanilla Extract', amount: 1, unit: 'tsp' }
      ]
    },
    coconut: {
      name: 'Coconut Cream',
      baseYield: 1.5,
      ingredients: [
        { name: 'Coconut Cream', amount: 2, unit: 'cups' },
        { name: 'Coconut Milk', amount: 1, unit: 'cup' },
        { name: 'Sugar', amount: 0.75, unit: 'cup' },
        { name: 'Shredded Coconut', amount: 0.5, unit: 'cup' },
        { name: 'Vanilla Extract', amount: 1, unit: 'tsp' }
      ]
    },
    lemon: {
      name: 'Lemon Sorbet',
      baseYield: 1.5,
      ingredients: [
        { name: 'Water', amount: 2.5, unit: 'cups' },
        { name: 'Sugar', amount: 1, unit: 'cup' },
        { name: 'Lemon Juice', amount: 1, unit: 'cup' },
        { name: 'Lemon Zest', amount: 2, unit: 'tbsp' }
      ]
    },
    bubblegum: {
      name: 'Bubblegum',
      baseYield: 1.5,
      ingredients: [
        { name: 'Heavy Cream', amount: 2, unit: 'cups' },
        { name: 'Whole Milk', amount: 1, unit: 'cup' },
        { name: 'Sugar', amount: 0.75, unit: 'cup' },
        { name: 'Bubblegum Extract', amount: 2, unit: 'tsp' },
        { name: 'Mini Gumballs', amount: 0.5, unit: 'cup' },
        { name: 'Pink Food Coloring', amount: 4, unit: 'drops' }
      ]
    }
  };

  const addAvailableIngredient = () => {
    const newId = Math.max(...availableIngredients.map(i => i.id), 0) + 1;
    setAvailableIngredients([...availableIngredients, { id: newId, name: '', amount: 0, unit: 'cups' }]);
  };

  const removeAvailableIngredient = (id) => {
    setAvailableIngredients(availableIngredients.filter(i => i.id !== id));
  };

  const updateAvailableIngredient = (id, field, value) => {
    setAvailableIngredients(availableIngredients.map(i => 
      i.id === id ? { ...i, [field]: value } : i
    ));
  };

  const addCustomIngredient = () => {
    const newId = Math.max(...customIngredients.map(i => i.id), 0) + 1;
    setCustomIngredients([...customIngredients, { id: newId, name: '', amount: 0, unit: 'cups' }]);
  };

  const removeCustomIngredient = (id) => {
    setCustomIngredients(customIngredients.filter(i => i.id !== id));
  };

  const updateCustomIngredient = (id, field, value) => {
    setCustomIngredients(customIngredients.map(i => 
      i.id === id ? { ...i, [field]: value } : i
    ));
  };

  const loadPresetToCustom = (presetKey) => {
    const recipe = presetRecipes[presetKey];
    setCustomIngredients(recipe.ingredients.map((ing, idx) => ({
      id: idx + 1,
      ...ing
    })));
    setBaseYield(recipe.baseYield);
  };

  const convertToCommonUnit = (amount, unit) => {
    // Convert everything to cups for comparison
    let cups = amount;
    if (unit === 'tbsp') cups = amount / 16;
    else if (unit === 'tsp') cups = amount / 48;
    else if (unit === 'ml') cups = amount / 236.588;
    else if (unit === 'oz') cups = amount / 8;
    else if (unit === 'drops') cups = amount / 4800; // approximate
    else if (unit === 'cup' || unit === 'cups') cups = amount;
    else if (unit === 'g') cups = amount / 200; // approximate for dry ingredients
    return cups;
  };

  const checkIngredients = (recipe, targetYield) => {
    const baseYield = recipe.baseYield;
    const scaleFactor = targetYield / baseYield;
    const missing = [];
    let canMakeFlag = true;

    const scaled = recipe.ingredients.map(ing => {
      const scaledAmount = ing.amount * scaleFactor;
      const neededInCups = convertToCommonUnit(scaledAmount, ing.unit);
      
      // Find matching ingredient in available ingredients
      const available = availableIngredients.find(av => 
        av.name.toLowerCase().trim() === ing.name.toLowerCase().trim()
      );

      if (!available) {
        missing.push({ ...ing, scaledAmount: scaledAmount.toFixed(2), status: 'missing' });
        canMakeFlag = false;
      } else {
        const availableInCups = convertToCommonUnit(available.amount, available.unit);
        if (availableInCups < neededInCups) {
          missing.push({ 
            ...ing, 
            scaledAmount: scaledAmount.toFixed(2), 
            available: available.amount,
            availableUnit: available.unit,
            status: 'insufficient' 
          });
          canMakeFlag = false;
        }
      }

      return {
        ...ing,
        scaledAmount: scaledAmount.toFixed(2)
      };
    });

    return { scaled, canMakeFlag, missing };
  };

  const getSuggestedRecipes = () => {
    const suggestions = [];
    
    for (const [key, recipe] of Object.entries(presetRecipes)) {
      const targetYield = whynterModels[selectedModel].optimal;
      const result = checkIngredients(recipe, targetYield);
      
      if (result.canMakeFlag) {
        suggestions.push({
          key,
          name: recipe.name,
          canMake: true,
          missing: []
        });
      } else {
        suggestions.push({
          key,
          name: recipe.name,
          canMake: false,
          missing: result.missing
        });
      }
    }
    
    // Sort: recipes you can make first, then by number of missing ingredients
    suggestions.sort((a, b) => {
      if (a.canMake && !b.canMake) return -1;
      if (!a.canMake && b.canMake) return 1;
      return a.missing.length - b.missing.length;
    });
    
    return suggestions;
  };

  const suggestedRecipes = mode === 'pantry' ? getSuggestedRecipes() : [];

  useEffect(() => {
    if (mode === 'pantry') {
      const recipe = presetRecipes[selectedFlavor];
      const targetYield = whynterModels[selectedModel].optimal;
      const result = checkIngredients(recipe, targetYield);
      
      setScaledRecipe(result.scaled);
      setCanMake(result.canMakeFlag);
      setMissingIngredients(result.missing);
    } else {
      // Scale mode - just calculate scaled recipe from preset
      const recipe = presetRecipes[selectedFlavor];
      const targetYield = whynterModels[selectedModel].optimal;
      const scaleFactor = targetYield / recipe.baseYield;
      const scaled = recipe.ingredients.map(ing => ({
        ...ing,
        scaledAmount: (ing.amount * scaleFactor).toFixed(2)
      }));
      setScaledRecipe(scaled);
      setCanMake(true);
      setMissingIngredients([]);
    }
  }, [mode, selectedFlavor, selectedModel, availableIngredients]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <ChefHat className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Whynter Ice Cream Calculator
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Perfect ice cream recipes for your Whynter maker
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-xl shadow-lg p-2 inline-flex gap-2">
            <button
              onClick={() => setMode('scale')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                mode === 'scale'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                <span>Scale My Recipe</span>
              </div>
            </button>
            <button
              onClick={() => setMode('pantry')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                mode === 'pantry'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Check My Pantry</span>
              </div>
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">
                {mode === 'scale' ? 'Scale Recipe Mode:' : 'Pantry Check Mode:'}
              </p>
              <p>
                {mode === 'scale' 
                  ? 'Enter your recipe and we\'ll scale it perfectly for your Whynter model\'s optimal capacity.'
                  : 'Enter your available ingredients and we\'ll tell you which ice cream flavors you can make!'
                }
              </p>
            </div>
          </div>
        </div>

        {/* MODE 1: SCALE RECIPE */}
        {mode === 'scale' && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Your Model & Flavor</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Model Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Whynter Model
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  >
                    {Object.entries(whynterModels).map(([key, model]) => (
                      <option key={key} value={key}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-2">
                    Optimal fill: {whynterModels[selectedModel].optimal} qt | Max: {whynterModels[selectedModel].max} qt
                  </p>
                </div>

                {/* Flavor Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose Ice Cream Flavor
                  </label>
                  <select
                    value={selectedFlavor}
                    onChange={(e) => setSelectedFlavor(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  >
                    {Object.entries(presetRecipes).map(([key, recipe]) => (
                      <option key={key} value={key}>
                        {recipe.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Flavor Grid */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quick Select:
                </label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {Object.entries(presetRecipes).map(([key, recipe]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedFlavor(key)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedFlavor === key
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {recipe.name.replace(' Ice Cream', '').replace(' Sorbet', '')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recipe Output */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {presetRecipes[selectedFlavor].name} Recipe
              </h2>

              {/* Scaled Ingredients */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <RefreshCw className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-800">
                    Ingredients (Scaled for {whynterModels[selectedModel].optimal} qt)
                  </h3>
                </div>
                <div className="space-y-3">
                  {scaledRecipe.map((ing, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 border-b border-purple-200 last:border-0">
                      <span className="font-medium text-gray-800 text-lg">{ing.name}</span>
                      <span className="text-purple-700 font-bold text-lg">
                        {ing.scaledAmount} {ing.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Instructions */}
                <div className="bg-blue-50 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-800 mb-3 text-lg">📋 Instructions</h3>
                  <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                    <li>Mix all ingredients in a bowl until sugar dissolves completely</li>
                    <li>Chill mixture in refrigerator for 2-4 hours (overnight is best)</li>
                    <li>Pour chilled mixture into your Whynter ice cream maker</li>
                    <li>Run for 30-50 minutes until desired consistency</li>
                    <li>Add mix-ins (chips, nuts, cookies) in the last 5 minutes if desired</li>
                    <li>Transfer to freezer-safe container and freeze 2+ hours for firmer texture</li>
                  </ol>
                </div>

                {/* Tips */}
                <div className="bg-yellow-50 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-800 mb-3 text-lg">💡 Pro Tips</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Pre-chill your mixture overnight for the smoothest texture</li>
                    <li>• Don't exceed the optimal fill level - ice cream expands while churning</li>
                    <li>• For fruit flavors: puree or mash fruit before adding to mixture</li>
                    <li>• Add alcohol sparingly (1-2 tbsp max) to prevent ice cream from freezing too hard</li>
                    <li>• Store in an airtight container with plastic wrap pressed against the surface</li>
                    <li>• Let ice cream sit at room temp for 5-10 minutes before scooping</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: CHECK PANTRY */}
        {mode === 'pantry' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Available Ingredients Section */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-800">Your Pantry</h2>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Add ingredients you currently have available
              </p>

              {/* Ingredients List */}
              <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {availableIngredients.map((ing) => (
                  <div key={ing.id} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        placeholder="Ingredient name"
                        value={ing.name}
                        onChange={(e) => updateAvailableIngredient(ing.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      />
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Amount"
                          value={ing.amount}
                          onChange={(e) => updateAvailableIngredient(ing.id, 'amount', parseFloat(e.target.value) || 0)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                        />
                        <select
                          value={ing.unit}
                          onChange={(e) => updateAvailableIngredient(ing.id, 'unit', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                        >
                          <option value="cups">cups</option>
                          <option value="cup">cup</option>
                          <option value="tbsp">tbsp</option>
                          <option value="tsp">tsp</option>
                          <option value="oz">oz</option>
                          <option value="ml">ml</option>
                          <option value="g">g</option>
                          <option value="drops">drops</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => removeAvailableIngredient(ing.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={addAvailableIngredient}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Ingredient
              </button>

              {/* Model Selection in Sidebar */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Whynter Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  {Object.entries(whynterModels).map(([key, model]) => (
                    <option key={key} value={key}>
                      {model.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Optimal: {whynterModels[selectedModel].optimal} qt
                </p>
              </div>
            </div>

            {/* Suggestions and Recipe Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Suggestions Section */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ChefHat className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Recipe Suggestions</h2>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Based on your ingredients, here's what you can make:
                </p>

                {/* Can Make Section */}
                {suggestedRecipes.filter(r => r.canMake).length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                      <span className="text-lg">✓</span> You Can Make ({suggestedRecipes.filter(r => r.canMake).length})
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {suggestedRecipes.filter(r => r.canMake).map((suggestion) => (
                        <button
                          key={suggestion.key}
                          onClick={() => setSelectedFlavor(suggestion.key)}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            selectedFlavor === suggestion.key
                              ? 'border-purple-600 bg-purple-50 shadow-md'
                              : 'border-green-200 bg-green-50 hover:border-green-400 hover:shadow'
                          }`}
                        >
                          <div className="font-semibold text-gray-800">{suggestion.name}</div>
                          <div className="text-xs text-green-600 mt-1">All ingredients available!</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Ingredients Section */}
                {suggestedRecipes.filter(r => !r.canMake).length > 0 && (
                  <div>
                    <h3 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                      <span className="text-lg">◐</span> Almost There (missing items)
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {suggestedRecipes.filter(r => !r.canMake).slice(0, 6).map((suggestion) => (
                        <button
                          key={suggestion.key}
                          onClick={() => setSelectedFlavor(suggestion.key)}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            selectedFlavor === suggestion.key
                              ? 'border-purple-600 bg-purple-50 shadow-md'
                              : 'border-orange-200 bg-orange-50 hover:border-orange-400 hover:shadow'
                          }`}
                        >
                          <div className="font-semibold text-gray-800">{suggestion.name}</div>
                          <div className="text-xs text-orange-600 mt-1">
                            Missing {suggestion.missing.length} ingredient{suggestion.missing.length > 1 ? 's' : ''}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Recipe Details */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                {/* Status Banner */}
                {!canMake ? (
                  <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4 rounded-r-lg">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-red-800">
                        <p className="font-semibold mb-1">Missing ingredients:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {missingIngredients.map((ing, idx) => (
                            <li key={idx}>
                              {ing.status === 'missing' 
                                ? `${ing.name} - Need ${ing.scaledAmount} ${ing.unit}`
                                : `${ing.name} - Need ${ing.scaledAmount} ${ing.unit}, have ${ing.available} ${ing.availableUnit}`
                              }
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-4 rounded-r-lg">
                    <div className="flex items-start gap-3">
                      <Calculator className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-green-800">
                        <p className="font-semibold">✓ You can make this recipe!</p>
                      </div>
                    </div>
                  </div>
                )}

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {presetRecipes[selectedFlavor].name} Recipe
                </h2>

                {/* Scaled Ingredients */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <RefreshCw className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-800">
                      Scaled for {whynterModels[selectedModel].optimal} qt
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {scaledRecipe.map((ing, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-purple-100 last:border-0">
                        <span className="font-medium text-gray-700">{ing.name}</span>
                        <span className="text-purple-700 font-semibold">
                          {ing.scaledAmount} {ing.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Instructions</h3>
                  <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                    <li>Mix all liquid ingredients in a bowl until sugar dissolves completely</li>
                    <li>Chill mixture in refrigerator for 2-4 hours (or overnight for best results)</li>
                    <li>Pour chilled mixture into your Whynter ice cream maker</li>
                    <li>Run for 30-50 minutes until desired consistency is reached</li>
                    <li>Add any mix-ins (chips, nuts, cookies) in the last 5 minutes of churning</li>
                    <li>Transfer to freezer-safe container and freeze for 2+ hours for firmer texture</li>
                  </ol>
                </div>

                {/* Tips */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">💡 Pro Tips</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Pre-chill your mixture overnight for the smoothest texture</li>
                    <li>• Don't exceed the optimal fill level - ice cream expands while churning</li>
                    <li>• For fruit flavors: puree or mash fruit before adding</li>
                    <li>• Add alcohol sparingly (1-2 tbsp) to prevent ice cream from freezing too hard</li>
                    <li>• Store in an airtight container with plastic wrap pressed against surface</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Compatible with all Whynter compressor ice cream makers</p>
          <p className="mt-1">Models: ICM-080, ICM-128WS, ICM-15LS, ICM-200LS, ICM-201SB, ICM-220, ICM-255SSY</p>
        </div>
      </div>
    </div>
  );
}
