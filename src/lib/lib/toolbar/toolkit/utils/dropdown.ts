import { Observable } from 'rxjs';

import { EventDelegate } from '../../help';

export interface DropdownViewer<T = any> {
  elementRef: HTMLElement | DocumentFragment;
  onComplete: Observable<any>;
  freezeState?: Observable<boolean>;

  update?(value?: T): void;

  reset?(): void;

  setEventDelegator?(delegate: EventDelegate): void;
}

export class Dropdown {
  readonly elementRef = document.createElement('span');
  freeze = false;

  set disabled(v: boolean) {
    this.button.disabled = v;
  }

  get disabled() {
    return this.button.disabled;
  }

  set highlight(v: boolean) {
    if (v) {
      this.button.classList.add('textbus-handler-active');
    } else {
      this.button.classList.remove('textbus-handler-active');
    }
  }

  set expand(b: boolean) {
    this._expand = b;
    if (b) {
      this.elementRef.classList.add('textbus-dropdown-open');
    } else {
      this.elementRef.classList.remove('textbus-dropdown-open');
    }
  }

  get expand() {
    return this._expand;
  }

  private _expand = false;

  private button = document.createElement('button');

  constructor(private inner: HTMLElement,
              private menuViewer: DropdownViewer,
              private tooltip = '',
              private limitDisplay: HTMLElement) {
    this.elementRef.classList.add('textbus-dropdown');

    this.button.classList.add('textbus-handler');
    this.button.type = 'button';
    this.button.title = tooltip;
    this.button.appendChild(inner);
    const dropdownArrow = document.createElement('span');
    dropdownArrow.classList.add('textbus-dropdown-caret');
    this.button.appendChild(dropdownArrow);

    this.elementRef.appendChild(this.button);

    const menu = document.createElement('div');
    menu.classList.add('textbus-dropdown-menu');
    menu.appendChild(menuViewer.elementRef);
    this.elementRef.appendChild(menu);

    const updatePosition = () => {
      if (this.elementRef.classList.contains('textbus-dropdown-open')) {
        const distance = this.limitDisplay.getBoundingClientRect().right - (this.elementRef.getBoundingClientRect().left + menu.offsetWidth);
        menu.style.left = `${Math.min(0, distance)}px`;
      }
    };

    let isSelfClick = false;
    menu.addEventListener('click', () => {
      isSelfClick = true;
    });

    document.addEventListener('click', () => {
      if (this.freeze) {
        return;
      }
      if (!isSelfClick) {
        this.expand = false;
      }
      isSelfClick = false;
    });
    this.button.addEventListener('click', () => {
      isSelfClick = true;
      this.expand = !this.expand;
      updatePosition();
    });

    window.addEventListener('resize', updatePosition);

    menuViewer.onComplete.subscribe(() => {
      this.freeze = false;
      this.expand = false;
    });
  }
}
