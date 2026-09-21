import { Component, input } from '@angular/core';

@Component({
  selector: 'app-custom-spinner',
  imports: [],
  templateUrl: './custom-spinner.html',
})
export class CustomSpinner {

  label = input.required<string>()
}
