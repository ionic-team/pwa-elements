import { h, Component, Prop, Element, Event, EventEmitter, State } from '@stencil/core';
import { ActionSheetOption } from '../../definitions';

@Component({
  tag: 'pwa-action-sheet',
  styleUrl: 'action-sheet.css',
  shadow: true
})

export class PWAActionSheet {
  @Element() el: HTMLElement;

  @Prop() header: string;

  @Prop() cancelable: boolean = true;

  @Prop() options: ActionSheetOption[] = [];

  @Event() onSelection: EventEmitter;

  @State() open = false;

  componentDidLoad() {
    requestAnimationFrame(() => {
      this.open = true;
    });
  }

  dismiss() {
    if (this.cancelable) {
      this.close();
    }
  }

  close() {
    this.open = false;
    setTimeout(() => {
      this.el.parentNode.removeChild(this.el);
    }, 500);
  }

  handleOptionClick(e: MouseEvent, i: number) {
    e.stopPropagation();
    this.onSelection.emit(i);
    this.close();
  }

  render() {
    return (
      <div class={`wrapper${this.open ? ' open' : ''}`} onClick={() => this.dismiss()}>
        <div class="content">
          <div class="title">{this.header}</div>
          {
            this.options.map((option, i) => 
              <div class="action-sheet-option" onClick={(e) => this.handleOptionClick(e, i)}>
                <div class="action-sheet-button">{option.title}</div>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}
