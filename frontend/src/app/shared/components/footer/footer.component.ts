import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  emailAddress = '';
  subscribed = false;

  onSubscribe(): void {
    if (this.emailAddress.trim()) {
      this.subscribed = true;
      this.emailAddress = '';
      setTimeout(() => {
        this.subscribed = false;
      }, 5000);
    }
  }
}
