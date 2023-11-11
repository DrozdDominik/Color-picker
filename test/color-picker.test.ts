import { html } from 'lit';
import { fixture, expect, aTimeout } from '@open-wc/testing';
import { ColorPicker } from '../src/ColorPicker.js';
import '../src/color-picker.js';
import { Colord, colord } from 'colord';

describe('ColorPicker', () => {
  const hue = 0;
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
      clientY: 200,
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
    const colorPreviewBackgroundColor = window.getComputedStyle(colorPreviewDiv!).backgroundColor;

    expect(el.selectedColor.toRgbString()).to.equal(colorPreviewBackgroundColor);
  });

  it('should rgb inputs value have correct initial values', async () => {
    const el = await fixture<ColorPicker>(html`<color-picker></color-picker>`);
    
    const red = el.selectedColor.toRgb().r;
    const green = el.selectedColor.toRgb().g;
    const blue = el.selectedColor.toRgb().b;
    
    const inputRed = (el.shadowRoot!.querySelector('.red') as HTMLInputElement);
    const inputGreen = (el.shadowRoot!.querySelector('.green') as HTMLInputElement);
    const inputBlue = (el.shadowRoot!.querySelector('.blue') as HTMLInputElement);

    const inputRedValue = Number(inputRed.value);
    const inputGreenValue = Number(inputGreen.value);
    const inputBlueValue = Number(inputBlue.value);
  
    expect(inputRedValue).to.equal(red);
    expect(inputGreenValue).to.equal(green);
    expect(inputBlueValue).to.equal(blue);
  });

  it('should hex input value has correct initial value', async () => {
    const el = await fixture<ColorPicker>(html`<color-picker></color-picker>`);
      
    const hex = el.selectedColor.toHex();
    const inputHex = (el.shadowRoot!.querySelector('.hex-input') as HTMLInputElement);
  
    expect(inputHex.value).to.equal(hex);
  });

  it('should change rgb inputs and hex input values when selectedColor value changed', async () => {
    const el = await fixture<ColorPicker>(html`<color-picker></color-picker>`);

    const inputRed = (el.shadowRoot!.querySelector('.red') as HTMLInputElement);
    const inputGreen = (el.shadowRoot!.querySelector('.green') as HTMLInputElement);
    const inputBlue = (el.shadowRoot!.querySelector('.blue') as HTMLInputElement);
    const inputHex = (el.shadowRoot!.querySelector('.hex-input') as HTMLInputElement);

    const initialInputRedValue = Number(inputRed.value);
    const initialInputGreenValue = Number(inputGreen.value);
    const initialInputBlueValue = Number(inputBlue.value);
    const initialInputHexValue = inputHex.value;
    
    const clickEvent = new MouseEvent('click', {
      clientX: 55,
      clientY: 99,
    });

    (el.shadowRoot!.querySelector('.gradient-square') as HTMLElement).dispatchEvent(clickEvent);

    await aTimeout(50);

    const newInputRedValue = Number(inputRed.value);
    const newInputGreenValue = Number(inputGreen.value);
    const newInputBlueValue = Number(inputBlue.value);
    const newInputHexValue = inputHex.value;

    const red = el.selectedColor.toRgb().r;
    const green = el.selectedColor.toRgb().g;
    const blue = el.selectedColor.toRgb().b;
    const hex = el.selectedColor.toHex();
           
  
    expect(initialInputRedValue).not.to.equal(newInputRedValue);
    expect(initialInputGreenValue).not.to.equal(newInputGreenValue);
    expect(initialInputBlueValue).not.to.equal(newInputBlueValue);
    expect(initialInputHexValue).not.to.equal(newInputHexValue);
    expect(newInputRedValue).to.equal(red);
    expect(newInputGreenValue).to.equal(green);
    expect(newInputBlueValue).to.equal(blue);
    expect(newInputHexValue).to.equal(hex);
  });

  it('should change selectedColor property value when one of rgb inputs value changed', async () => {
    const el = await fixture<ColorPicker>(html`<color-picker></color-picker>`);

    const initialSelectedColorValue = el.selectedColor.toRgbString();

    const inputRed = (el.shadowRoot!.querySelector('.red') as HTMLInputElement);
    const inputGreen = (el.shadowRoot!.querySelector('.green') as HTMLInputElement);
    const inputBlue = (el.shadowRoot!.querySelector('.blue') as HTMLInputElement);
    
    const inputGreenValue = inputGreen.value;

    let newGreenValue = (Math.floor(Math.random() * 256)).toString();

    while( inputGreenValue === newGreenValue ) {
       newGreenValue = (Math.floor(Math.random() * 256)).toString();
    }

    inputGreen.value = newGreenValue;

    inputGreen.dispatchEvent(new Event('input'));

    const newSelectedColorValue = colord({ r: Number(inputRed.value), g: Number(newGreenValue) , b: Number(inputBlue.value) });
   
    expect(initialSelectedColorValue).not.to.equal(el.selectedColor.toRgbString());
    expect(el.selectedColor.toRgbString()).to.equal(newSelectedColorValue.toRgbString())
  });

  it('should change rgb inputs background color when focused', async () => {
    const el = await fixture<ColorPicker>(html`<color-picker></color-picker>`);

    const redBackgroundColor = colord('#ff6961').toRgbString();
    const greenBackgroundColor = colord('#77dd77').toRgbString();
    const blueBackgroundColor = colord('#aec6cf').toRgbString();
    
    const inputRed = (el.shadowRoot!.querySelector('.red') as HTMLInputElement);
    const inputGreen = (el.shadowRoot!.querySelector('.green') as HTMLInputElement);
    const inputBlue = (el.shadowRoot!.querySelector('.blue') as HTMLInputElement);
    
    inputRed.focus();
    
    const focusedRedInputBackgroundColor = window.getComputedStyle(inputRed).backgroundColor;

    inputGreen.focus();
    
    const focusedGreenInputBackgroundColor = window.getComputedStyle(inputGreen).backgroundColor;

    inputBlue.focus();
    
    const focusedBlueInputBackgroundColor = window.getComputedStyle(inputBlue).backgroundColor;
    
    expect(focusedRedInputBackgroundColor).to.equal(redBackgroundColor);
    expect(focusedGreenInputBackgroundColor).to.equal(greenBackgroundColor);
    expect(focusedBlueInputBackgroundColor).to.equal(blueBackgroundColor);
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ColorPicker>(html`<color-picker></color-picker>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
