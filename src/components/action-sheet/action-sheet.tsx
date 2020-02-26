import { h, Component, Prop, Element, Event, EventEmitter } from '@stencil/core';
import { ActionSheetOption, ActionSheetOptionStyle } from '../../definitions';

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
    let contentClass = 'content';
    let containsCancel = this.options.find(option => option.style === ActionSheetOptionStyle.Cancel);
    if (containsCancel) {
      contentClass += " separation";
    }
    return (
      <div class="wrapper" onClick={() => this.close()}>
        <div class={contentClass}>
          <div class="title">{this.title}</div>
          {
            this.options.map((option, i) => {
              let buttonClass = 'action-sheet-button';
              if (option.style === ActionSheetOptionStyle.Destructive) {
                buttonClass += ' destructive'
              }
              if (option.style === ActionSheetOptionStyle.Cancel) {
                buttonClass += ' cancel'
              }
              return  <div class="action-sheet-option" onClick={(e) => this.handleOptionClick(e, i)}>
                        <div class={buttonClass}>{option.title}</div>
                      </div>
            })
          }
        </div>
      </div>
    );
  }
}
