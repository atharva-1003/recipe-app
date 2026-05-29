import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RecipeService } from '../../core/services/recipe.service';
import { Recipe } from '../../core/models/recipe.model';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [RouterLink, RecipeCardComponent],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly recipeService = inject(RecipeService);

  recipe: Recipe | null = null;
  relatedRecipes: Recipe[] = [];
  loading = true;
  loadingRelated = true;
  checkedIngredients: Set<number> = new Set();

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadRecipe(id);
        this.loadRelatedRecipes(id);
      }
    });
  }

  loadRecipe(id: number): void {
    this.loading = true;
    this.recipeService.getRecipeById(id).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
        this.loading = false;
        this.checkedIngredients.clear();
      },
      error: (err) => {
        console.error('Error loading recipe:', err);
        this.loading = false;
      }
    });
  }

  loadRelatedRecipes(currentId: number): void {
    this.loadingRelated = true;
    this.recipeService.getRecipes({ limit: 3, skip: currentId }).subscribe({
      next: (response) => {
        this.relatedRecipes = response.recipes.filter(r => r.id !== currentId).slice(0, 3);
        this.loadingRelated = false;
      },
      error: () => {
        this.loadingRelated = false;
      }
    });
  }

  toggleIngredient(index: number): void {
    if (this.checkedIngredients.has(index)) {
      this.checkedIngredients.delete(index);
    } else {
      this.checkedIngredients.add(index);
    }
  }

  isIngredientChecked(index: number): boolean {
    return this.checkedIngredients.has(index);
  }

  printRecipe(): void {
    window.print();
  }

  shareRecipe(): void {
    if (navigator.share && this.recipe) {
      navigator.share({
        title: this.recipe.name,
        text: `Check out this recipe: ${this.recipe.name}`,
        url: window.location.href
      }).catch(() => {});
    }
  }

  getStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.round(rating)).fill(0);
  }

  getPrimaryTag(): string {
    if (this.recipe?.tags && this.recipe.tags.length > 0) {
      return this.recipe.tags[0];
    }
    return '';
  }

  getMealTypeLabel(): string {
    if (this.recipe?.mealType && this.recipe.mealType.length > 0) {
      return this.recipe.mealType[0];
    }
    return '';
  }
}
