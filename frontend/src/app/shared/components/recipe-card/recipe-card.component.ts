import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Recipe } from '../../../core/models/recipe.model';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent implements OnInit {
  @Input({ required: true }) recipe!: Recipe;
  @Output() favoriteToggled = new EventEmitter<void>();
  isFavorite = false;

  ngOnInit(): void {
    this.checkFavoriteStatus();
  }

  checkFavoriteStatus(): void {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    this.isFavorite = favorites.includes(this.recipe.id);
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (this.isFavorite) {
      favorites = favorites.filter((id: number) => id !== this.recipe.id);
    } else {
      favorites.push(this.recipe.id);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    this.isFavorite = !this.isFavorite;
    this.favoriteToggled.emit();
  }

  getPrimaryTag(): string {
    if (this.recipe.tags && this.recipe.tags.length > 0) {
      return this.recipe.tags[0];
    }
    if (this.recipe.mealType && this.recipe.mealType.length > 0) {
      return this.recipe.mealType[0];
    }
    return 'Recipe';
  }

  // Returns array of numbers up to the rounded rating
  getStars(rating: number): number[] {
    const rounded = Math.round(rating);
    return Array(rounded).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    const rounded = Math.round(rating);
    return Array(5 - rounded).fill(0);
  }
}
