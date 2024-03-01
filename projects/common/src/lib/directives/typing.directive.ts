import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[ovoTyping]',
  standalone: true,
})
export class OvoTypingDirective implements OnInit, OnChanges {
  @Input() ovoTyping!: string;
  @Input() ovoTypingColor!: string;

  constructor(private elementRef: ElementRef<HTMLSpanElement>) { }

  private _count = 0;

  get backgroundSize() {
    return `calc(${this._count}*1ch) 200%`;
  }

  get animation() {
    return `b .035s infinite steps(1), t calc(${this._count}*.015s) steps(${this._count}) forwards`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.init(changes['text']?.currentValue);
  }

  ngOnInit(): void {
    this.init(this.ovoTyping);
  }

  private init(text: string) {
    if (text) {
      this._count = text.length;

      const nativeElement = this.elementRef.nativeElement;

      if (nativeElement) {
        nativeElement.insertAdjacentHTML("beforebegin", `
        <style>
          @keyframes t {
            from {
              background-size: 0 200%
            }
          }

          @keyframes b {
            50% {
              background-position: 0 -100%, 0 0
            }
          }
        </style>
        `);

        const color = this.ovoTypingColor || window.getComputedStyle(nativeElement, null).getPropertyValue('color');
        nativeElement.style.setProperty('color', '#0000');
        nativeElement.style.setProperty('font-family', 'monospace');
        nativeElement.style.setProperty('background', `linear-gradient(-90deg, ${color} 5px, #0000 0) 10px 0, linear-gradient(${color} 0 0) 0 0`);
        nativeElement.style.setProperty('-webkit-background-clip', 'padding-box, text');
        nativeElement.style.setProperty('background-clip', 'padding-box, text');
        nativeElement.style.setProperty('background-repeat', 'no-repeat');
        nativeElement.style.animation = this.animation;
        nativeElement.style.backgroundSize = this.backgroundSize;
        nativeElement.classList.add('typing');
        nativeElement.innerHTML = text;
      }
    } else {
      this._count = 0;
    }
  }
}
