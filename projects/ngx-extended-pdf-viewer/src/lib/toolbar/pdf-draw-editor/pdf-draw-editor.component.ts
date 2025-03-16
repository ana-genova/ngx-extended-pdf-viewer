import { ChangeDetectorRef, Component, Input, effect } from '@angular/core';
import { AnnotationEditorEditorModeChangedEvent } from '../../events/annotation-editor-mode-changed-event';
import { IPDFViewerApplication } from '../../options/pdf-viewer-application';
import { PDFNotificationService } from '../../pdf-notification-service';
import { ResponsiveVisibility } from '../../responsive-visibility';

@Component({
  selector: 'pdf-draw-editor',
  templateUrl: './pdf-draw-editor.component.html',
  styleUrls: ['./pdf-draw-editor.component.css'],
})
export class PdfDrawEditorComponent {
  @Input()
  public show: ResponsiveVisibility = true;

  public isSelected = false;

  private PDFViewerApplication: IPDFViewerApplication | undefined;

  constructor(
    private notificationService: PDFNotificationService,
    private cdr: ChangeDetectorRef,
  ) {
    effect(() => {
      this.PDFViewerApplication = notificationService.onPDFJSInitSignal();
      if (this.PDFViewerApplication) {
        this.onPdfJsInit();
      }
    });
  }

  private onPdfJsInit() {
    this.PDFViewerApplication?.eventBus.on('annotationeditormodechanged', ({ mode }: AnnotationEditorEditorModeChangedEvent) => {
      setTimeout(() => {
        this.isSelected = mode === 15;
        this.cdr.detectChanges();
      });
    });
  }

  public onClick(event: PointerEvent): void {
    let button = event.target;
    while (button && button instanceof Element && !(button instanceof HTMLButtonElement)) {
      button = button.parentElement;
    }

    if (button instanceof HTMLButtonElement) {
      // #2817 this is a workaround for when the button is initially hidden.
      // In that case, the dummy component gets the click listener.
      // As a quick work around, let's simply call the click listener of the dummy component.
      if (button.id === 'primaryEditorInk' && document.getElementById('primaryEditorInk') !== button) {
        document.getElementById('primaryEditorInk')?.click();
      }
      if (button.id !== 'primaryEditorInk') {
        document.getElementById('primaryEditorInk')?.click();
      }
    }
  }
}
