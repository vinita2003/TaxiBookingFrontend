import { Directive, ElementRef, Input, DoCheck } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appStyleOnError]',
})
export class StyleOnErrorDirective implements DoCheck {
  @Input() appStyleOnError: boolean = false;

  private previousValue: boolean = false;

  constructor(private el: ElementRef) {}

  ngDoCheck(): void {
    if (this.appStyleOnError !== this.previousValue) {
      this.previousValue = this.appStyleOnError;

      if (this.appStyleOnError) {
        this.el.nativeElement.style.border = '2px solid red';
      } else {
        this.el.nativeElement.style.border = '';
      }
    }
  }
}
