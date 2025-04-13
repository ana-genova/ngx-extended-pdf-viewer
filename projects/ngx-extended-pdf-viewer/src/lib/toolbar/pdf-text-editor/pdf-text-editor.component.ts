import { ChangeDetectorRef, Component, Input, effect } from '@angular/core';
import { PositioningService } from '../../dynamic-css/positioning.service';
import { AnnotationEditorEditorModeChangedEvent } from '../../events/annotation-editor-mode-changed-event';
import { IPDFViewerApplication } from '../../options/pdf-viewer-application';
import { PDFNotificationService } from '../../pdf-notification-service';
import { ResponsiveVisibility } from '../../responsive-visibility';

@Component({
  selector: 'pdf-text-editor',
  templateUrl: './pdf-text-editor.component.html',
  styleUrls: ['./pdf-text-editor.component.css'],
})
export class PdfTextEditorComponent {
  @Input()
  public show: ResponsiveVisibility = true;

  public isSelected = false;
  private PDFViewerApplication: IPDFViewerApplication | undefined;

  constructor(
    notificationService: PDFNotificationService,
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
        this.isSelected = mode === 3;
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
      if (button.id === 'primaryEditorFreeText' && document.getElementById('primaryEditorFreeText') !== button) {
        document.getElementById('primaryEditorFreeText')?.click();
      }
      if (button.id !== 'primaryEditorFreeText') {
        document.getElementById('primaryEditorFreeText')?.click();
      }
      const positioningService = new PositioningService();
      positioningService.positionPopupBelowItsButton('primaryEditorFreeText', 'editorFreeTextParamsToolbar');
    }
  }
}
