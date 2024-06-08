<script lang="ts">
  import { ConversionType, convertToURL, testValidSVG } from "@/scripts/svg";

  // Options
  let wrapOutput: boolean = true;
  let conversionType: ConversionType = ConversionType.UrlString;

  // Binds to the text boxes
  let inputText: string = "";
  let outputText: string;
  $: outputText = convertToURL(inputText, conversionType);

  // Info about the input
  let notBlankSVG: boolean;
  $: notBlankSVG = inputText !== "";
  let validSVG: boolean;
  $: validSVG = testValidSVG(inputText);
  let sizedSVG: boolean;
  $: {
    let hasWidthOrHeight = inputText.match(/^<svg[^>]+((\swidth="\d+")|(\sheight="\d+"))/) !== null;
    sizedSVG = validSVG && hasWidthOrHeight;
  }

  // Copy functionality
  let copiedText: boolean = false;
  let previousTimer: NodeJS.Timeout | undefined = undefined;

  function copyOutput() {
    // Check if the button is disabled
    if (!validSVG) {
      return;
    }

    // Copy via the weird API and show new text
    navigator.clipboard.writeText(outputText);
    copiedText = true;

    if (previousTimer) {
      clearTimeout(previousTimer);
    }
    previousTimer = setTimeout(() => {
      copiedText = false;
    }, 1000);
  }

  // Output click to copy
  function handleOutputClick(e: Event) {
    if (!validSVG) {
      return;
    }
    (e.target as HTMLInputElement).select();
  }

  // Modes
  type ConversionTypeChoice = {
    name: string;
    value: ConversionType;
    default: boolean;
  };

  // prettier-ignore
  const modes: ConversionTypeChoice[] = [
        { name: "URL String", value: ConversionType.UrlString, default: true },
        { name: "Background image", value: ConversionType.BackgroundImage, default: false },
        { name: "Boilerplate", value: ConversionType.Boilerplate, default: false },
    ];

  function handleModeChange(mode: ConversionType) {
    // Disable wrapping for multi-line output types
    if (mode === ConversionType.Boilerplate || mode === ConversionType.BackgroundImage) {
      wrapOutput = false;
    } else {
      wrapOutput = true;
    }
  }
</script>

<div class="two-grid">
  <div class="input-text">
    <p>Input</p>
    <textarea
      bind:value={inputText}
      placeholder="Write your SVG here..."
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      rows="15"
    />
  </div>

  <div class="output-text">
    <div class="title-spread">
      <p>Output</p>
      <label>
        <input type="checkbox" role="switch" bind:checked={wrapOutput} />Wrap text
      </label>
    </div>
    <div class="overlay">
      <textarea
        class:invalid={!validSVG && notBlankSVG}
        class:valid={validSVG && notBlankSVG}
        class:no-wrap-output={!wrapOutput}
        bind:value={outputText}
        on:click={(e) => handleOutputClick(e)}
        placeholder="URL will appear here!"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        readonly={true}
        rows="15"
      />
      {#if validSVG}
        <button on:click={copyOutput} class="copy-button secondary" disabled={!validSVG}
          >{copiedText ? "Text copied!" : "Copy"}</button
        >
      {/if}
    </div>
  </div>
</div>

<div class="two-grid">
  <fieldset class="extra-options">
    <legend>Mode:</legend>
    {#each modes as mode}
      <label>
        <input
          type="radio"
          bind:group={conversionType}
          value={mode.value}
          checked={mode.default}
          on:change={() => handleModeChange(mode.value)}
        />
        {mode.name}
      </label>
    {/each}
  </fieldset>
  <div class="preview-box" class:shrink-to-fit={sizedSVG}>
    <p>Preview{validSVG && !sizedSVG ? " (No max size)" : ""}:</p>
    <div class="preview-inner">
      {#if validSVG}
        {@html inputText}
      {/if}
    </div>
  </div>
</div>

<style>
  p,
  label,
  textarea {
    margin: 0;
  }

  .two-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    &:has(+ .two-grid) {
      margin-bottom: 1rem;
    }
  }

  .output-text {
    & .valid {
      color: var(--pico-form-element-valid-active-border-color);
    }
    & .invalid {
      color: var(--pico-form-element-invalid-active-border-color);
    }

    & textarea.no-wrap-output {
      text-wrap: nowrap;
      overflow-x: auto;
    }
  }

  .title-spread {
    display: flex;
    justify-content: space-between;
  }

  .overlay {
    display: grid;
    grid-template-columns: 1fr;
  }

  .overlay > * {
    grid-column-start: 1;
    grid-row-start: 1;
  }

  .copy-button {
    padding: 0.25rem 0.5rem;
    align-self: end;
    justify-self: end;
    z-index: 1;
  }

  fieldset {
    margin-inline: auto;
  }

  .preview-box {
    --preview-size: 250px;
    --max-size: 400px;
    min-width: var(--preview-size);
    max-width: 100%;
    max-height: var(--max-size);
    padding: 8px;
    margin-inline: auto;
    border: 2px solid;
    overflow: auto;
  }

  .shrink-to-fit {
    display: grid;
    grid-template-rows: auto 1fr;
    place-items: start;
  }

  .preview-inner:not(:empty) {
    width: fit-content;
    border: 2px dashed var(--pico-muted-color);
  }

  .preview-inner :global(svg) {
    display: block;
  }
</style>
