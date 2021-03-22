import { Component, OnInit } from '@angular/core';
import { AccountData } from 'src/app/interfaces/intefaces';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isAccountClicked = false;
  accountData: AccountData = { id: 1 };

  constructor() {}

  ngOnInit(): void {}

  accountClick(id) {
    this.isAccountClicked = true;
    switch (id) {
      case 'login':
        this.accountData = {
          id: 1,
          headerTitle: 'LogIn',
          linkText: "Don't have an account yet? Register",
          forgotButtonText:'Forgot your password?',
          buttonText: 'Login',
        };
        break;
      case 'register':
        this.accountData = {
          id: 2,
          headerTitle: 'Register',
          linkText: 'Already have an account? Login',
          forgotButtonText:'Forgot your password?',
          buttonText: 'Register',
        };
        break;
    }
  }

  close() {
    this.isAccountClicked = false;
  }
}
