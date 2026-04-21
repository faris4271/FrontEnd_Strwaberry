import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us-component',
  imports: [],
  templateUrl: './about-us-component.html',
  styleUrl: './about-us-component.css',
})
export class AboutUsComponent {
onUploadClick() {
    console.log('Upload triggered');
  }
}
