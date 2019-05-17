import { h, Component, Prop, Element, State } from '@stencil/core';

@Component({
  tag: 'pwa-toast',
  styleUrl: 'toast.css',
  shadow: true
})
export class PWAToast {
  @Element() el: HTMLElement;

  @Prop() message: string;

  @Prop() duration: number = 2000;

  @State() closing = null;

  hostData() {
    const classes = {
      out: !!this.closing
    }

    if (this.closing !== null) {
      classes['in'] = !this.closing;
    }
    return {
      class: classes
    }
  }

  componentDidLoad() {
    setTimeout(() => {
      this.closing = false;
    });
    setTimeout(() => {
      this.close();
    }, this.duration)
  }

  close() {
    this.closing = true;
    setTimeout(() => {
      this.el.parentNode.removeChild(this.el);
    }, 1000);
  }

  render() {
    return (
      <div class="wrapper">
        <div class="toast">
          {this.message}
        </div>
      </div>
    );
  }
}
