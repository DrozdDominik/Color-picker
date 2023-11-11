import { html } from 'lit';
import { fixture, expect, aTimeout } from '@open-wc/testing';
import { ColorPicker } from '../src/ColorPicker.js';
import '../src/color-picker.js';
import { Colord, colord } from 'colord';

describe('ColorPicker', () => {
  const hue = 1;
  const saturation = 100;
  const value = 100;
  const selectedColorValue = colord({ h: hue, s: saturation, v: value }).toRgbString();

  it('should has properties initialized correctly', async () => {
    const el = await fixture<ColorPicker>(html`<color-picker></color-picker>`);

    expect(el.hue).to.equal(hue);
    expect(el.saturation).to.equal(saturation);
    expect(el.value).to.equal(value);
    expect(el.selectedColor).to.instanceOf(Colord);
    expect(el.selectedColor.toRgbString()).to.equal(selectedColorValue);
  });

  it('should change selectedColor value when gradient-square clicked', async () => {
    const el = await fixture<ColorPicker>(html`<color-picker></color-picker>`);
    
    expect(el.selectedColor.toRgbString()).to.equal(selectedColorValue);

    const clickEvent = new MouseEvent('click', {
      clientX: 100,
      clientY: 200
    });

    (el.shadowRoot!.querySelector('.gradient-square') as HTMLElement).dispatchEvent(clickEvent);

    await aTimeout(50);

    expect(el.selectedColor).to.instanceOf(Colord);
    expect(el.selectedColor.toRgbString()).not.to.equal(selectedColorValue);
  });

  it('should input type range value equals hue property value', async () => {
    const el = await fixture<ColorPicker>(html`<color-picker></color-picker>`);

    const input = (el.shadowRoot!.querySelector('div.slider input') as HTMLInputElement);
    const inputValue = Number(input.value);
   
    expect(inputValue).to.equal(hue);
  });

  it('should change hue property value when input range value changed', async () => {
    const el = await fixture<ColorPicker>(html`<color-picker></color-picker>`);

    const input = (el.shadowRoot!.querySelector('div.slider input') as HTMLInputElement);
    const inputInitialValue = Number(input.value);
  
    expect(inputInitialValue).to.equal(el.hue);
    
    const newInputValue = '44';

    input.value = newInputValue;

    input.dispatchEvent(new Event('input'));

    const newHueValue = Number(newInputValue);
    
    expect(el.hue).to.equal(newHueValue);
  });

  it('should color-preview div background color value equals selectedColor', async () => {
    const el = await fixture<ColorPicker>(html`<color-picker></color-picker>`);

    const colorPreviewDiv = el.shadowRoot!.querySelector('.color-preview');
    const colorPreviewBackgroundColor = window.getComputedStyle(colorPreviewDiv!).backgroundColor

    expect(el.selectedColor.toRgbString()).to.equal(colorPreviewBackgroundColor)
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ColorPicker>(html`<color-picker></color-picker>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
