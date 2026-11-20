import { Component, output, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
  readonly menuToggle = output<void>();
  private readonly router = inject(Router);
  readonly notificationOpen = signal(false);

  searchTickets(event: Event): void {
    const search = (event.target as HTMLInputElement).value.trim();
    if (search) void this.router.navigate(['/tickets'], { queryParams: { search } });
  }

  toggleNotifications(): void {
    this.notificationOpen.update((open) => !open);
  }
}
