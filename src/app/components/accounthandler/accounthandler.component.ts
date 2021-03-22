import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { AccountData } from 'src/app/interfaces/intefaces';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-accounthandler',
  templateUrl: './accounthandler.component.html',
  styleUrls: ['./accounthandler.component.css'],
})
export class AccounthandlerComponent implements OnInit {
  public dialogWidth: string = '50%';
  public dialogHeight: string = '70%';
  public showCloseIcon: boolean = true;
  @ViewChild('ejsAccountDialog') ejDialog: DialogComponent;
  @Output() close = new EventEmitter<string>();
  @Input() accountData: AccountData;
  isForgotPassword = false;

  constructor(
    private ngxLoader: NgxUiLoaderService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {}

  closeDialog() {
    this.close.emit('close');
  }

  startSpinner(timeDuration) {
    timeDuration = timeDuration * 1000;
    this.ngxLoader.start();
    setTimeout(() => {
      this.ngxLoader.stop();
    }, timeDuration);
  }

  showSpinner(timeDuration) {
    timeDuration = timeDuration * 1000;
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, timeDuration);
  }

  loadForgotPassword() {
    this.showSpinner(1);
    this.isForgotPassword = true;
    this.accountData.headerTitle = 'Forgot your Password?';
     this.accountData.buttonText = 'Reset Password';
  }

  registerContent(){
    this.setContent();
    this.accountData.headerTitle = 'Register';
    this.accountData.buttonText = 'Register';
    this.accountData.linkText = 'Already have an account? Login';

  }

  loginContent(){
    this.setContent();
    this.accountData.headerTitle = 'Login';
    this.accountData.buttonText = 'Login';
    this.accountData.linkText = "Don't have an account yet? Register";
  }

  setContent(){
    this.showSpinner(1);
    this.isForgotPassword = false;
    this.accountData.forgotButtonText = 'Forgot your password?';
  }

  refreshContent() {
    this.showSpinner(1);

    if (this.accountData.linkText === 'Already have an account? Login') {
      this.accountData.headerTitle = 'Login';
      this.accountData.buttonText = 'Login';
      this.accountData.linkText = "Don't have an account yet? Register";
    }
    else {
      this.accountData.headerTitle = 'Register';
      this.accountData.buttonText = 'Register';
      this.accountData.linkText = 'Already have an account? Login';
    }

    this.isForgotPassword = false;
    this.accountData.forgotButtonText = 'Forgot your password?';
  }
}
