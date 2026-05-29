import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../core/services/recipe.service';
import { Recipe } from '../../core/models/recipe.model';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule, RecipeCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private readonly recipeService = inject(RecipeService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  searchQuery = '';
  seasonalPicks: Recipe[] = [];
  trendingRecipes: Recipe[] = [];
  loadingSeasonal = true;
  loadingTrending = true;

  // Carousel controls
  activeCarouselIndex = 0;

  // Newsletter form
  emailAddress = '';
  newsletterSubscribed = false;

  // Category data matching the Stitch design
  categories = [
    { label: 'Breakfast', icon: 'bakery_dining', mealType: 'Breakfast' },
    { label: 'Lunch', icon: 'lunch_dining', mealType: 'Lunch' },
    { label: 'Dinner', icon: 'dinner_dining', mealType: 'Dinner' },
    { label: 'Dessert', icon: 'icecream', mealType: 'Dessert' }
  ];

  ngOnInit(): void {
    this.loadSeasonalPicks();
    this.loadTrendingRecipes();
  }

  loadSeasonalPicks(): void {
    this.recipeService.getRecipes({ limit: 4, skip: 0 }).subscribe({
      next: (response) => {
        this.seasonalPicks = response.recipes;
        this.loadingSeasonal = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading seasonal picks:', err);
        this.loadingSeasonal = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadTrendingRecipes(): void {
    this.recipeService.getRecipes({ limit: 3, skip: 4 }).subscribe({
      next: (response) => {
        this.trendingRecipes = response.recipes;
        this.loadingTrending = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading trending recipes:', err);
        this.loadingTrending = false;
        this.cdr.detectChanges();
      }
    });
  }

  onHeroSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/explorer'], { queryParams: { q: this.searchQuery.trim() } });
    }
  }

  navigateToCategory(mealType: string): void {
    this.router.navigate(['/explorer'], { queryParams: { mealType } });
  }

  nextCarousel(): void {
    if (this.seasonalPicks.length > 0) {
      this.activeCarouselIndex = (this.activeCarouselIndex + 1) % this.seasonalPicks.length;
      this.cdr.detectChanges();
    }
  }

  prevCarousel(): void {
    if (this.seasonalPicks.length > 0) {
      this.activeCarouselIndex = (this.activeCarouselIndex - 1 + this.seasonalPicks.length) % this.seasonalPicks.length;
      this.cdr.detectChanges();
    }
  }

  onNewsletterSubmit(): void {
    if (this.emailAddress.trim()) {
      this.newsletterSubscribed = true;
      this.emailAddress = '';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.newsletterSubscribed = false;
        this.cdr.detectChanges();
      }, 5000);
    }
  }
}
