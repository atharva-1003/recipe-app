import { Injectable, isDevMode, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe, RecipesResponse } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private readonly http = inject(HttpClient);
  
  // Dev uses Express proxy (port 3000), Prod goes direct to DummyJSON
  private readonly baseUrl = isDevMode() 
    ? 'http://localhost:3000/api' 
    : 'https://dummyjson.com';

  /**
   * Get all recipes with optional pagination, sorting, and field selection
   */
  getRecipes(options?: {
    limit?: number;
    skip?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
    select?: string;
  }): Observable<RecipesResponse> {
    let params = new HttpParams();
    if (options) {
      if (options.limit !== undefined) params = params.set('limit', options.limit.toString());
      if (options.skip !== undefined) params = params.set('skip', options.skip.toString());
      if (options.sortBy) params = params.set('sortBy', options.sortBy);
      if (options.order) params = params.set('order', options.order);
      if (options.select) params = params.set('select', options.select);
    }
    return this.http.get<RecipesResponse>(`${this.baseUrl}/recipes`, { params });
  }

  /**
   * Get a single recipe by ID
   */
  getRecipeById(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.baseUrl}/recipes/${id}`);
  }

  /**
   * Search recipes by query string
   */
  searchRecipes(query: string): Observable<RecipesResponse> {
    return this.http.get<RecipesResponse>(`${this.baseUrl}/recipes/search`, {
      params: new HttpParams().set('q', query)
    });
  }

  /**
   * Get all recipe tags
   */
  getTags(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/recipes/tags`);
  }

  /**
   * Get recipes by tag
   */
  getRecipesByTag(tag: string): Observable<RecipesResponse> {
    return this.http.get<RecipesResponse>(`${this.baseUrl}/recipes/tag/${encodeURIComponent(tag)}`);
  }

  /**
   * Get recipes by meal type
   */
  getRecipesByMealType(type: string): Observable<RecipesResponse> {
    return this.http.get<RecipesResponse>(`${this.baseUrl}/recipes/meal-type/${encodeURIComponent(type)}`);
  }
}
