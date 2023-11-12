import { html, css, LitElement } from 'lit';
import { property, query } from 'lit/decorators.js';
import { colord } from 'colord';

export class ColorPicker extends LitElement {
  static styles = css`
    :host {
      --size: var(--picker-width, 750px)
    }
    .container {
      width: var(--size);
      height: calc(var(--size) / 3);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
    }
    .main {
      margin-bottom: calc(var(--size) / 30);
      display: flex;
      justify-content: space-between;
    }
    .gradient-square {
      margin: 0 calc(var(--size) / 75);
      position: relative;
      width: calc(var(--size) / 3.75);
      height: calc(var(--size) / 3.75);
      cursor: crosshair;
    }
    .selector {
      position: absolute;
      border: 1px solid #fff;
      border-radius: 50%;
      width: calc(var(--size) / 75);
      height: calc(var(--size) / 75);
      transform: translate(-50%, -50%);
      pointer-events: none;
    }
    .slider {
      display: block;
      width: 80%;
      height: calc(var(--size) / 30);
      background: linear-gradient(
        to right,
        red,
        yellow,
        lime,
        aqua,
        blue,
        magenta,
        red
      );
    }
    input[type='range'] {
      width: 100%;
      height: calc(var(--size) / 25);
      background: transparent;
      -webkit-appearance: none;
    }
    input[type='range']::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: calc(var(--size) / 50);
      height: calc(var(--size) / 25);
      background: white;
      cursor: pointer;
    }
    .color-preview {
      width: calc(var(--size) / 7.5);
      height: calc(var(--size) / 7.5);
      margin: calc(var(--size) / 15) calc(var(--size) / 75);
    }
    .inputs {
      width: calc(var(--size) / 2.25);
      height: calc(var(--size) / 3.75);
      margin: 0 calc(var(--size) / 75);
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .rgb-inputs {
      margin-bottom: calc(var(--size) / 75);
    }

    .inputs {
      font-size: calc(var(--size) / 50);
    }

    .inputs input {
      width: calc(var(--size) / 11);
      height: calc(var(--size) / 37.5);
      font-size: calc(var(--size) / 60);
      display: inline-block;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
      text-align: center;
    }

    .inputs input:focus {
      outline: none;
    }

    .red:focus {
      background-color: #ff6961;
    }

    .green:focus {
      background-color: #77dd77;
    }

    .blue:focus {
      background-color: #aec6cf;
    }
  `;

  @property({ type: Number })
  hue = 0;

  @property({ type: Number })
  saturation = 100;

  @property({ type: Number })
  value = 100;

  @property({ attribute: false })
  selectedColor = colord({ h: this.hue, s: this.saturation, v: this.value });

  @query('.red')
  _red?: HTMLInputElement;

  @query('.green')
  _green?: HTMLInputElement;

  @query('.blue')
  _blue?: HTMLInputElement;

  render() {
    return html`
      <div class="container">
        <div class="main">
          <div
            class="gradient-square"
            style="background: 
              linear-gradient(to top, black, rgba(0, 0, 0, 0)),
              linear-gradient(to right, white, ${colord({
              h: this.hue,
              s: 100,
              v: 100,
            }).toRgbString()})"
            @click="${this.handleClick}"
          >
            <div
              class="selector"
              style="left: ${this.saturation}%; top: ${100 - this.value}%"
            ></div>
          </div>
          <div
            class="color-preview"
            style="background-color: ${this.selectedColor.toRgbString()};"
          ></div>
          <div class="inputs">
            <div class="rgb-inputs">
              <p><b>RGB values</b></p>
              <label>
                Red
                <input
                  class="red"
                  type="number"
                  .value="${this.selectedColor.toRgb().r.toString()}"
                  min="0"
                  max="255"
                  @input="${this.handleInput}"
                />
              </label>
              <label>
                Green
                <input
                  class="green"
                  type="number"
                  .value="${this.selectedColor.toRgb().g.toString()}"
                  min="0"
                  max="255"
                  @input="${this.handleInput}"
                />
              </label>
              <label>
                Blue
                <input
                  class="blue"
                  type="number"
                  .value="${this.selectedColor.toRgb().b.toString()}"
                  min="0"
                  max="255"
                  @input="${this.handleInput}"
                />
              </label>
            </div>
            <div>
              <label
                ><b>Hex value</b>
                <input
                  class="hex-input"
                  type="text"
                  .value="${this.selectedColor.toHex()}"
                  readonly
                />
              </label>
            </div>
          </div>
        </div>
        <div class="slider">
          <label aria-label="hue slider">
            <input
              type="range"
              min="0"
              max="360"
              .value="${this.hue.toString()}"
              @input="${this.handleHueChange}"
            />
          </label>
        </div>
      </div>
    `;
  }

  handleClick(event: MouseEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.saturation = ((event.clientX - rect.left) / rect.width) * 100;
    this.value = 100 - ((event.clientY - rect.top) / rect.height) * 100;
    this.selectedColor = colord({
      h: this.hue,
      s: this.saturation,
      v: this.value,
    });
  }

  handleHueChange(event: Event) {
    this.hue = parseInt((event.target as HTMLInputElement).value);
    this.selectedColor = colord({
      h: this.hue,
      s: this.saturation,
      v: this.value,
    });
  }

  handleInput() {
    const newColor = colord({
      r: Number(this._red?.value),
      g: Number(this._green?.value),
      b: Number(this._blue?.value),
    });
    this.selectedColor = newColor;
    const newColorHsv = newColor.toHsv();
    this.hue = newColorHsv.h;
    this.saturation = newColorHsv.s;
    this.value = newColorHsv.v;
  }
}
