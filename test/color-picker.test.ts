import { html } from 'lit';
import { fixture, expect, aTimeout } from '@open-wc/testing';
import { ColorPicker } from '../src/ColorPicker.js';
import '../src/color-picker.js';
import { Colord, colord } from 'colord';

describe('ColorPicker', () => {
  const hue = 1
  const saturation = 100
  const value = 100
  const selectedColorValue = colord({ h: hue, s: saturation, v: value }).toRgbString()

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

  it('passes the a11y audit', async () => {
    const el = await fixture<ColorPicker>(html`<color-picker></color-picker>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
