import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../core/services/recipe.service';
import { Recipe } from '../../core/models/recipe.model';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';

@Component({
  selector: 'app-explorer',
  standalone: true,
  imports: [FormsModule, RecipeCardComponent],
  templateUrl: './explorer.component.html',
  styleUrl: './explorer.component.css'
})
export class ExplorerComponent implements OnInit {
  private readonly recipeService = inject(RecipeService);
  private readonly route = inject(ActivatedRoute);

  recipes: Recipe[] = [];
  allRecipes: Recipe[] = [];
  loading = true;
  searchQuery = '';
  totalRecipes = 0;

  // Filter states
  selectedMealType = '';
  selectedDifficulties: string[] = [];
  selectedSortBy = 'popular';
  minRating = 0;
  maxCalories = 1500;

  // Available meal types from Stitch design
  mealTypes = ['Dinner', 'Breakfast', 'Lunch', 'Dessert', 'Snack', 'Side dish'];
  difficulties = ['Easy', 'Medium', 'Hard'];
  sortOptions = [
    { label: 'Popular', value: 'popular' },
    { label: 'Newest', value: 'newest' },
    { label: 'Rating', value: 'rating' }
  ];

  // Load more state
  currentPage = 0;
  pageSize = 9;
  loadingMore = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchQuery = params['q'];
        this.searchRecipes();
      } else if (params['mealType']) {
        this.selectedMealType = params['mealType'];
        this.loadRecipesByMealType(params['mealType']);
      } else if (params['sortBy'] === 'rating') {
        this.selectedSortBy = 'rating';
        this.loadAllRecipes();
      } else {
        this.loadAllRecipes();
      }
    });
  }

  loadAllRecipes(): void {
    this.loading = true;
    this.recipeService.getRecipes({ limit: 50, skip: 0 }).subscribe({
      next: (response) => {
        this.allRecipes = response.recipes;
        this.totalRecipes = response.total;
        this.applyFiltersAndSort();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  searchRecipes(): void {
    if (!this.searchQuery.trim()) {
      this.loadAllRecipes();
      return;
    }
    this.loading = true;
    this.recipeService.searchRecipes(this.searchQuery.trim()).subscribe({
      next: (response) => {
        this.allRecipes = response.recipes;
        this.totalRecipes = response.total;
        this.applyFiltersAndSort();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadRecipesByMealType(type: string): void {
    this.loading = true;
    this.recipeService.getRecipesByMealType(type).subscribe({
      next: (response) => {
        this.allRecipes = response.recipes;
        this.totalRecipes = response.total;
        this.applyFiltersAndSort();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.searchRecipes();
  }

  toggleMealType(type: string): void {
    if (this.selectedMealType === type) {
      this.selectedMealType = '';
    } else {
      this.selectedMealType = type;
    }
    this.applyFiltersAndSort();
  }

  toggleDifficulty(difficulty: string): void {
    const idx = this.selectedDifficulties.indexOf(difficulty);
    if (idx >= 0) {
      this.selectedDifficulties.splice(idx, 1);
    } else {
      this.selectedDifficulties.push(difficulty);
    }
    this.applyFiltersAndSort();
  }

  setMinRating(rating: number): void {
    this.minRating = rating;
    this.applyFiltersAndSort();
  }

  onCaloriesChange(event: Event): void {
    this.maxCalories = +(event.target as HTMLInputElement).value;
    this.applyFiltersAndSort();
  }

  setSortBy(sortBy: string): void {
    this.selectedSortBy = sortBy;
    this.applyFiltersAndSort();
  }

  clearFilters(): void {
    this.selectedMealType = '';
    this.selectedDifficulties = [];
    this.minRating = 0;
    this.maxCalories = 1500;
    this.searchQuery = '';
    this.applyFiltersAndSort();
  }

  applyFiltersAndSort(): void {
    let filtered = [...this.allRecipes];

    // Filter by meal type
    if (this.selectedMealType) {
      filtered = filtered.filter(r =>
        r.mealType && r.mealType.some(mt => mt.toLowerCase() === this.selectedMealType.toLowerCase())
      );
    }

    // Filter by difficulty
    if (this.selectedDifficulties.length > 0) {
      filtered = filtered.filter(r => this.selectedDifficulties.includes(r.difficulty));
    }

    // Filter by rating
    if (this.minRating > 0) {
      filtered = filtered.filter(r => r.rating >= this.minRating);
    }

    // Filter by calories
    if (this.maxCalories < 1500) {
      filtered = filtered.filter(r => r.caloriesPerServing <= this.maxCalories);
    }

    // Sort
    switch (this.selectedSortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default: // popular — by review count
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    this.totalRecipes = filtered.length;
    this.currentPage = 0;
    this.recipes = filtered.slice(0, this.pageSize);
  }

  loadMore(): void {
    this.loadingMore = true;
    this.currentPage++;
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;

    // Simulate a slight delay for UX
    setTimeout(() => {
      let filtered = [...this.allRecipes];
      // Apply the same filters
      if (this.selectedMealType) {
        filtered = filtered.filter(r =>
          r.mealType && r.mealType.some(mt => mt.toLowerCase() === this.selectedMealType.toLowerCase())
        );
      }
      if (this.selectedDifficulties.length > 0) {
        filtered = filtered.filter(r => this.selectedDifficulties.includes(r.difficulty));
      }
      if (this.minRating > 0) {
        filtered = filtered.filter(r => r.rating >= this.minRating);
      }
      if (this.maxCalories < 1500) {
        filtered = filtered.filter(r => r.caloriesPerServing <= this.maxCalories);
      }

      const moreRecipes = filtered.slice(start, end);
      this.recipes = [...this.recipes, ...moreRecipes];
      this.loadingMore = false;
    }, 400);
  }

  hasMore(): boolean {
    return this.recipes.length < this.totalRecipes;
  }

  getRatingStars(count: number): number[] {
    return Array(count).fill(0);
  }

  getEmptyStars(count: number): number[] {
    return Array(5 - count).fill(0);
  }
}
