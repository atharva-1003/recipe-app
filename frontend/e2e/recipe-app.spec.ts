import { test, expect } from '@playwright/test';

test.describe('Recipe Hub E2E Tests', () => {

  test('should load Home Page correctly and verify main components', async ({ page }) => {
    await page.goto('/');

    // 1. Title and header
    await expect(page).toHaveTitle(/Culinary Harvest — Premium Recipe Hub/);
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header.locator('.logo')).toContainText('Culinary Harvest');

    // 2. Hero Section
    const heroSection = page.locator('#home-hero');
    await expect(heroSection).toBeVisible();
    await expect(heroSection.locator('h1')).toContainText('Nourish Your Kitchen');
    
    // 3. Category exploration grid
    const categoriesSection = page.locator('#categories');
    await expect(categoriesSection).toBeVisible();
    await expect(categoriesSection.locator('.category-card')).toHaveCount(4);

    // 4. Chef's Seasonal Picks Carousel
    const seasonalSection = page.locator('#seasonal-picks');
    await expect(seasonalSection).toBeVisible();
    await expect(seasonalSection.locator('h2')).toContainText("Chef's Seasonal Picks");

    // 5. Trending Section
    const trendingSection = page.locator('#trending');
    await expect(trendingSection).toBeVisible();
    await expect(trendingSection.locator('h2')).toContainText('Trending This Week');

    // 6. Newsletter CTA
    const newsletterSection = page.locator('#newsletter-cta');
    await expect(newsletterSection).toBeVisible();
    await expect(newsletterSection.locator('h2')).toContainText('Fresh Inspiration in Your Inbox');
  });

  test('should navigate to Explorer and apply filters', async ({ page }) => {
    await page.goto('/');

    // Click on "Breakfast" category card
    await page.locator('.category-card').filter({ hasText: 'Breakfast' }).click();

    // Verify it navigates to Explorer page
    await expect(page).toHaveURL(/\/explorer\?mealType=Breakfast/);

    // Verify recipe cards are loaded
    const recipeGrid = page.locator('#recipe-grid');
    await expect(recipeGrid).toBeVisible();
    await expect(recipeGrid.locator('app-recipe-card')).not.toHaveCount(0);
    
    // Check filter sidebar is present
    const filterSidebar = page.locator('#filter-sidebar');
    await expect(filterSidebar).toBeVisible();

    // Meal type Breakfast pill should be active (case insensitive check)
    const activePill = filterSidebar.locator('.meal-pill.active');
    await expect(activePill).toContainText('Breakfast', { ignoreCase: true });

    // Type a search query in global header search
    const searchInput = page.locator('.header .search-input');
    await searchInput.fill('Pancakes');
    await searchInput.press('Enter');

    // Verify search query URL update
    await expect(page).toHaveURL(/Pancakes/);

    // Click on Clear Filters
    await page.locator('.clear-filters-btn').click();
    await expect(page).toHaveURL(/\/explorer/);
  });

  test('should open Recipe Detail page and interact with ingredients and instructions', async ({ page }) => {
    // Go to home page, wait for trending recipes, and click the first recipe card
    await page.goto('/');
    
    // Wait for the trending section recipe cards to load (increase timeout for slow networks)
    const trendingCard = page.locator('.trending-grid app-recipe-card').first();
    await expect(trendingCard).toBeVisible({ timeout: 15000 });

    // Click the trending recipe card link
    await trendingCard.locator('.recipe-card').click();

    // Verify we are on the detail page
    await expect(page).toHaveURL(/\/recipe\/\d+/);

    // Verify recipe header components
    const recipeHeader = page.locator('#recipe-header');
    await expect(recipeHeader).toBeVisible();
    await expect(recipeHeader.locator('.recipe-name')).not.toBeEmpty();

    // Verify stats chips
    const statsOverlay = recipeHeader.locator('.hero-stats-overlay');
    await expect(statsOverlay).toBeVisible();
    await expect(statsOverlay.locator('.stat-chip')).toHaveCount(5); // Prep, Cook, Calories, Difficulty, Rating

    // Verify ingredients and check one
    const ingredientsPanel = page.locator('.ingredients-panel');
    await expect(ingredientsPanel).toBeVisible();
    
    const ingredientRow = ingredientsPanel.locator('.ingredient-row').first();
    await expect(ingredientRow).toBeVisible();
    
    // Click ingredient checkbox
    const checkbox = ingredientRow.locator('.ingredient-checkbox');
    await checkbox.check();

    // Verify ingredient row gets checked class (indicating strikethrough styling)
    await expect(ingredientRow).toHaveClass(/checked/);

    // Verify preparation steps
    const instructionsPanel = page.locator('.instructions-panel');
    await expect(instructionsPanel).toBeVisible();
    await expect(instructionsPanel.locator('.step-item')).not.toHaveCount(0);
  });

});
