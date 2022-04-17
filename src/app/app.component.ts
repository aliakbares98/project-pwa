import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OktaAuthService } from '@okta/okta-angular';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AngularBooksPWA';
  searchForm!: FormGroup;
  isAuthenticated!: boolean;
  offline!: boolean;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    public oktaAuth: OktaAuthService) {
    this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated
    )
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      search: ['', Validators.required],
    });
    this.oktaAuth.isAuthenticated().then((auth) => {this.isAuthenticated = auth});


    window.addEventListener('online',  this.onNetworkStatusChange.bind(this));
window.addEventListener('offline', this.onNetworkStatusChange.bind(this));
  }

  async login(): Promise<void> {
    await this.oktaAuth.signInWithRedirect();
  }
  
  async logout(): Promise<void> {
    await this.oktaAuth.signOut();
  }
  onSearch(): void {
    if (!this.searchForm.valid) { return; }
    this.router.navigate(['search'], { queryParams: {} });
  }
  onNetworkStatusChange(): void {
    this.offline = !navigator.onLine;
    console.log('offline ' + this.offline);
  }
}
