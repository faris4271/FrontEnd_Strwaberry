import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-about-us-component',
  imports: [TranslateModule, RouterLink],
  templateUrl: './about-us-component.html',
  styleUrl: './about-us-component.css',
})
export class AboutUsComponent {
onUploadClick() {
    console.log('Upload triggered');
  }
}
