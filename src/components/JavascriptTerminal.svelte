<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  type LogItem = {
    text: string;
    id: number;
  };

  let commandIndex: number = -1; // The current command selected (-1 is current)
  let savedCommand: string = ""; // For the current command when looking up history
  let currentCommand: string = "";
  let previousCommands: string[] = []; // Command history

  let terminalLog: LogItem[] = []; // The log itself
  const context: Object = {};

  function writeLog(text: string) {
    const newEntry: LogItem = {
      text,
      id: terminalLog.length,
    };
    terminalLog = [newEntry, ...terminalLog];
  }

  function wrappedEval(js: string, context: Object) {
    return function () {
      let result: any = "";
      try {
        result = eval(js);
      } catch (error: unknown) {
        if (typeof error === "string") {
          result = error.toUpperCase();
        } else if (error instanceof Error) {
          result = error.message;
        }
      }
      return result;
    }.call(context);
  }

  function handleSubmit(_e: Event) {
    // Only log real commands to the previous commands buffer
    if (currentCommand.trim() !== "") {
      previousCommands = [currentCommand, ...previousCommands];
    }

    writeLog("> " + currentCommand);
    let result: string = wrappedEval(currentCommand, context);
    writeLog(result);

    currentCommand = "";
  }

  function handleInputKey(event: KeyboardEvent) {
    if (event.code === "ArrowUp" && commandIndex < previousCommands.length - 1) {
      event.preventDefault();
      if (commandIndex === -1) {
        currentCommand = savedCommand;
      }
      commandIndex += 1;
      currentCommand = previousCommands.at(commandIndex) as string;
    }
    if (event.code === "ArrowDown" && commandIndex !== -1) {
      event.preventDefault();
      commandIndex -= 1;
      if (commandIndex === -1) {
        currentCommand = savedCommand;
      } else {
        currentCommand = previousCommands.at(commandIndex) as string;
      }
    }
  }

  function addCommandOverrides() {
    // Override console.log
    const oldLog = console.log;
    console.log = function () {
      writeLog([...arguments].join(" "));
      oldLog.apply(console, arguments as any);
    };

    // Add clear command
    (window as any).clear = () => {
      terminalLog = [];
      return "";
    };
  }

  onMount(() => {
    addCommandOverrides();
    writeLog("Terminal loaded!");
    writeLog("Use `this` to store variables (e.g. this.a = 420)");
  });
</script>

<ul class="terminal-out">
  {#each terminalLog as log (log.id)}
    <li transition:fade>{log.text}</li>
  {/each}
</ul>
<form on:submit|preventDefault={handleSubmit}>
  <!-- svelte-ignore a11y-no-redundant-roles -->
  <fieldset role="group">
    <input
      type="text"
      bind:value={currentCommand}
      on:keydown={handleInputKey}
      autocomplete="off"
      placeholder="Command..."
    />
    <input type="submit" value="Evaluate" />
  </fieldset>
</form>

<style>
  .terminal-out {
    height: 300px;
    display: flex;
    flex-direction: column-reverse;
    overflow-y: auto;
    background: var(--pico-form-element-background-color);
    border: var(--pico-border-width) solid var(--pico-form-element-border-color);
  }
  ul {
    padding: 0.25rem 0.5rem;
    font-family: var(--pico-font-family-monospace);
    font-size: 0.9rem;
  }
  ul li {
    list-style: none;
  }
</style>
