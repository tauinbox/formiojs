import { BaseComponent } from '../base/Base';
export class ButtonComponent extends BaseComponent {
  elementInfo() {
    let info = super.elementInfo();
    info.type = 'button';
    info.attr.type = this.component.action;
    info.attr.class = 'btn btn-' + this.component.theme;
    if (this.component.block) {
      info.attr.class += ' btn-block';
    }
    return info;
  }

  set loading(loading) {
    this._loading = loading;
    if (!this.loader && loading) {
      this.loader = this.ce('buttonLoader', 'i', {
        class: 'glyphicon glyphicon-refresh glyphicon-spin button-icon-right'
      });
    }
    if (this.loader) {
      if (loading) {
        this.element.appendChild(this.loader);
      }
      else {
        this.element.removeChild(this.loader);
      }
    }
  }

  set disabled(disabled) {
    super.disabled = disabled;
    this.element.disable = disabled;
  }

  build() {
    this.element = this.ce('element', this.info.type, this.info.attr);
    if (this.component.label) {
      this.label = this.text(this.component.label);
      this.element.appendChild(this.label);
    }
    this.on('submitDone', () => {
      this.loading = false;
      this.disabled = false;
    }, true);
    this.on('error', () => {
      this.loading = false;
    }, true);
    this.addEventListener(this.element, 'click', (event) => {
      switch (this.component.action) {
        case 'submit':
          this.loading = true;
          this.disabled = true;
          event.preventDefault();
          event.stopPropagation();
          this.emit('submitButton');
          break;
        case 'event':
          this.events.emit(this.component.event, this.data);
          break;
        case 'reset':
          this.emit('resetForm');
          break;
        case 'oauth':
          console.log('OAuth currently not supported.');
          break;
      }
    });
    if (this.options.readOnly) {
      this.disabled = true;
    }
  }
}
