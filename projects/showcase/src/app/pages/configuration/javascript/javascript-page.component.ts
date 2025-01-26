import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxExtendedPdfViewerModule, pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { ContentPageComponent } from '../../../shared/components/content-page/content-page.component';
import { MarkdownContentComponent } from '../../../shared/components/markdown-content.component';
import { SplitViewComponent } from '../../../shared/components/split-view.component';
import { SetDefaultViewerHeightDirective } from '../../../shared/directives/set-default-viewer-height.directive';
import { SetDefaultZoomLevelDirective } from '../../../shared/directives/set-default-zoom-level.directive';
import { SetMinifiedLibraryUsageDirective } from '../../../shared/directives/set-minified-library-usage.directive';
import { BROWSER_STORAGE } from '../../../shared/helper/browser-storage.token';
import { WINDOW } from '../../../shared/helper/window.token';

@Component({
  selector: 'pvs-javascript-page',
  standalone: true,
  imports: [
    ContentPageComponent,
    MarkdownContentComponent,
    NgxExtendedPdfViewerModule,
    SplitViewComponent,
    SetMinifiedLibraryUsageDirective,
    FormsModule,
    SetDefaultViewerHeightDirective,
    SetDefaultZoomLevelDirective,
  ],
  template: `<pvs-content-page [demoTemplate]="demo">
    <pvs-markdown src="/assets/pages/configuration/javascript/text.md" />
    <ng-template #demo>
      <pvs-split-view>
        <p class="mb-1">
          The demo needs JavaScript to put the cursor into the first form field, to validate your input, and to implement the "re-initialize" button.
        </p>

        <div class="checkbox-group">
          <div class="input-group">
            <input id="enable-js" type="checkbox" [(ngModel)]="enableScripting" />
          </div>
          <label for="enable-js">Enable JavaScript (toggling forces reload)</label>
        </div>
        <p>If JavaScript is activated, </p>
        <ul class="list-disc list-inside pl-4">
          <li>the demo puts the cursor into the first form field,</li>
          <li>the "réinitializer" button clears your input fields,</li>
          <li>and the top-most input field validates your input.</li>
          <li>Without JavaScript, these features aren't available.</li>
        </ul>
        <ngx-extended-pdf-viewer
          slot="end"
          src="/assets/pdfs/160F-2019.pdf"
          [textLayer]="true"
          [showPresentationModeButton]="true"
          pvsSetMinifiedLibraryUsage
          pvsSetDefaultViewerHeight
          pvsSetDefaultZoomLevel
        />
      </pvs-split-view>
    </ng-template>
  </pvs-content-page>`,
})
export class JavaScriptPageComponent {
  private localStorage = inject(BROWSER_STORAGE);
  private window = inject(WINDOW);
  private key = 'ngx-extended-pdf-viewer.enableScripting';

  constructor() {
    if (!this.localStorage) {
      return;
    }
    try {
      const setting = this.localStorage.getItem(this.key);
      if (setting) {
        pdfDefaultOptions.enableScripting = setting === 'true';
      }
    } catch (safariSecurityException) {
      // localStorage is not available on Safari
    }
  }

  public get enableScripting(): boolean {
    return pdfDefaultOptions.enableScripting;
  }

  public set enableScripting(enable: boolean) {
    pdfDefaultOptions.enableScripting = enable;
    try {
      if (this.localStorage) {
        this.localStorage.setItem(this.key, String(enable));
        this.window?.location.reload();
      }
    } catch (safariSecurityException) {
      // localStorage is not available on Safari
    }
  }
}
