<script lang="ts">
  let addBackgrounds: boolean = false;
  let width: number = 9.2;
  let height: number = 8;
</script>

<div class={{ wrapper: true, backgrounds: addBackgrounds }} style={`--width: ${width}rem;--height: ${height}rem`}>
  <div>
    <p class="label">Marquees</p>
    <!-- svelte-ignore a11y-distracting-elements -->
    <marquee behavior="alternate" direction="up" class="outer">
      <!-- svelte-ignore a11y-distracting-elements -->
      <marquee behavior="alternate" direction="right" class="inner">📀</marquee>
    </marquee>
  </div>
  <div class="css-styled">
    <p class="label">CSS Animations</p>
    <div class="outer">
      <div class="inner">📀</div>
    </div>
  </div>
</div>
<div>
  <fieldset class="grid">
    <label>
      Width
      <input type="number" max="30" min="0" bind:value={width} />
    </label>
    <label>
      Height
      <input type="number" max="30" min="0" bind:value={height} />
    </label>
  </fieldset>
  <label>
    <input type="checkbox" bind:checked={addBackgrounds} /> Backgrounds
  </label>
</div>

<style>
  .label {
    margin-bottom: 0;
    text-align: center;
  }

  fieldset.grid {
    row-gap: 0.5rem;
    margin-bottom: 0.5;
  }
  label input {
    margin-bottom: 0;
  }

  /* Bouncer styles */
  :root {
    --outer: #f1aec2;
    --inner: #acd19c;
    --width: 9.2rem;
    --height: 8rem;
    --aspect-ratio: 9.2 / 8;
    --speed: 3.35s;
  }

  .wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  marquee {
    display: block;
  }
  .outer {
    width: var(--width);
    height: var(--height);
    background: var(--pico-background-color);
    border: var(--pico-border-width) solid var(--pico-card-border-color);
  }
  /* Add backgrounds */
  .backgrounds {
    .outer {
      background: var(--outer);
    }
    .inner {
      background: var(--inner);
    }
  }

  .css-styled {
    .outer {
      position: relative;
      width: var(--width);
      height: var(--height);
    }

    .inner {
      position: absolute;
      animation:
        bounce-up var(--speed) linear infinite,
        bounce-right calc(var(--speed) * var(--aspect-ratio)) linear infinite;
    }
  }

  @keyframes bounce-right {
    0%,
    100% {
      left: 0;
    }
    50% {
      left: calc(100% - 1rem);
    }
  }

  @keyframes bounce-up {
    0%,
    100% {
      bottom: 0;
    }
    50% {
      bottom: calc(100% - 1rem);
    }
  }
</style>
