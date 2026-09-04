import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { routes } from '../../../app.routes';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './navbar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class Navbar {

  private router = inject(Router);
  routes = routes
    .filter(route => route.path != '**')
    .map(route => ({
      path: route.path,
      title: `${route.title ?? 'Maps in Angular'}`
    }));

  pageTitle$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(event => event.url),
    map(url => routes.find(route => `/${route.path}` === url)?.title)
  )
}
