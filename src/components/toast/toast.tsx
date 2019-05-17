import { h, Component, Prop, Host, State } from '@stencil/core';

@Component({
  tag: 'pwa-toast',
  styleUrl: 'toast.css',
  shadow: true
})
export class PWAToast {
  el: HTMLPwaToastElement;

  @Prop() message: string;

  @Prop() duration: number = 2000;

  @State() closing = null;

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

  render = () => (
    <Host ref={(el: HTMLPwaToastElement) => (this.el = el)} class={{
      in: this.closing !== null && !this.closing,
      out: !!this.closing,
    }}>
      <div class="wrapper">
        <div class="toast">
          {this.message}
        </div>
      </div>
    </Host>
  );
}
