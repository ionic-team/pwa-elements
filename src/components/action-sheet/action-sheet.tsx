import { h, Component, Prop, Element, Event, EventEmitter } from '@stencil/core';
import { ActionSheetOption } from '../../definitions';

@Component({
  tag: 'pwa-action-sheet',
  styleUrl: 'action-sheet.css',
  shadow: true
})

export class PWAActionSheet {
  @Element() el: HTMLElement;

  @Prop() title: string;

  @Prop() message: string;

  @Prop() options: ActionSheetOption[] = [];

  @Event() onSelection: EventEmitter;

  close() {
    this.el.parentNode.removeChild(this.el);
  }

  handleOptionClick(e: MouseEvent, i: number) {
    e.stopPropagation();
    this.onSelection.emit(i);
    this.close();
  }

  render() {
    return (
      <div class="wrapper" onClick={() => this.close()}>
        <div class="content">
          <div class="title">{this.title}</div>
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
