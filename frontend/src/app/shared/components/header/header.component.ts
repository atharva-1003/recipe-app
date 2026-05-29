import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private readonly router = inject(Router);
  searchQuery = '';
  isMobileMenuOpen = false;

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/explorer'], { queryParams: { q: this.searchQuery.trim() } });
      this.searchQuery = '';
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
