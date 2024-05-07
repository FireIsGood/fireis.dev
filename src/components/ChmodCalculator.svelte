<script lang="ts">
  type Group = {
    title?: string;
    read: boolean;
    write: boolean;
    execute: boolean;
  };

  type PresetOctal = `${number}${number}${number}` | "custom";
  type Preset = {
    name: string;
    octal: PresetOctal;
  };

  // True values
  let permissionGroups: Group[] = [
    { title: "Owner", read: false, write: false, execute: false },
    { title: "Group", read: false, write: false, execute: false },
    { title: "Other", read: false, write: false, execute: false },
  ];
  let permissionOctal: string;
  let permissionBit: string;

  // Proxy values
  let inputPermissionOctal = "000";
  let inputPermissionBit = "---------";

  function permToOctal(group: Group[]) {
    permissionOctal = group
      .map(({ read, write, execute }) => Number(read) * 4 + Number(write) * 2 + Number(execute))
      .join("");
    inputPermissionOctal = permissionOctal;
  }

  function invertPermToOctal(permission: string) {
    const matchesPattern = /^[0-7]{3}$/.test(permission);
    if (!matchesPattern) return;

    permissionOctal = inputPermissionOctal;

    // Parse into the actual groups
    permission.split("").forEach((val, index) => {
      if (permissionGroups.at(index) === undefined) return;
      const bits = parseInt(val, 8).toString(2).padStart(3, "0");
      permissionGroups.at(index)!.read = bits.at(0) === "1";
      permissionGroups.at(index)!.write = bits.at(1) === "1";
      permissionGroups.at(index)!.execute = bits.at(2) === "1";
    });
    permissionGroups = permissionGroups; // Svelte jank lol

    const permissionIsPreset = presetList.filter((preset) => preset.octal === permission).length !== 0;
    if (permissionIsPreset) {
      presetValue = permission as PresetOctal;
    } else {
      presetValue = "custom";
    }
  }

  function permToBit(group: Group[]) {
    permissionBit = group
      .map(({ read, write, execute }) => {
        const r = read ? "r" : "-";
        const w = write ? "w" : "-";
        const x = execute ? "x" : "-";
        return r + w + x;
      })
      .join("");
    inputPermissionBit = permissionBit;
  }

  function invertPermToBit(permission: string) {
    const matchesPattern = /^([r-][w-][x-]){3}$/.test(permission);
    if (!matchesPattern) return;

    permissionBit = inputPermissionBit;

    // Parse into the actual groups
    const chunkSize = 3;
    for (let index = 0; index < permission.length; index += chunkSize) {
      const bits = [...permission.slice(index, index + chunkSize)].map((e: string) => e !== "-");
      permissionGroups.at(index / chunkSize)!.read = bits.at(0)!;
      permissionGroups.at(index / chunkSize)!.write = bits.at(1)!;
      permissionGroups.at(index / chunkSize)!.execute = bits.at(2)!;
    }
    permissionGroups = permissionGroups; // Svelte jank lol
  }

  function listAsEnglish(list: string[]) {
    let output = "";
    list.forEach((item, index) => {
      output += `<strong>${item}</strong>`;

      // Add the correct postfix
      if (list.length !== 1) {
        if (list.length === 2 && index === list.length - 2) {
          output += " and ";
        } else if (list.length >= 3 && index === list.length - 2) {
          output += ", and ";
        } else if (index <= list.length - 2) {
          output += ", ";
        }
      }
    });

    return output;
  }

  function permissionToText(group: Group) {
    const { read, write, execute } = group;
    const regroup = [read && "read", write && "write", execute && "execute"].filter((v) => v !== false) as string[];
    if (regroup.length === 0) {
      return "<strong>cannot do anything</strong>";
    }
    return "can " + listAsEnglish(regroup);
  }

  // Patterns
  const octalPattern = "[0-7]{3}";
  const symbolicPattern = "([r\\-][w\\-][x\\-]){3}";

  // Reactivity

  $: permToOctal(permissionGroups);
  $: invertPermToOctal(inputPermissionOctal);
  $: permToBit(permissionGroups);
  $: invertPermToBit(inputPermissionBit);

  $: octalValid = new RegExp(octalPattern).test(inputPermissionOctal);
  $: symbolicValid = new RegExp(symbolicPattern).test(inputPermissionBit);

  // Presets
  let presetValue: PresetOctal = "custom";
  const presetList: Preset[] = [
    { name: "No access", octal: "000" },
    { name: "Everyone full access", octal: "777" },
    { name: "Everyone read write", octal: "666" },
    { name: "Only owner full access", octal: "700" },
    { name: "Custom", octal: "custom" },
  ];

  $: if (presetValue !== "custom") {
    inputPermissionOctal = presetValue;
  }
</script>

<div class="grid permisson-split">
  <div class="group-left">
    <section>
      <h2>Group Permissions</h2>
      <div class="permission-groups">
        {#each permissionGroups as group}
          <div>
            <p class="group-title">{group.title}</p>
            <label><input type="checkbox" bind:checked={group.read} />Read</label>
            <label><input type="checkbox" bind:checked={group.write} />Write</label>
            <label><input type="checkbox" bind:checked={group.execute} />Execute</label>
          </div>
        {/each}
      </div>
    </section>
    <section class="preset-group">
      <h3>Presets</h3>
      <fieldset>
        {#each presetList as { name, octal }}
          <label
            ><input type="radio" name="preset" bind:group={presetValue} value={octal} />{name}{octal !== "custom"
              ? ` (${octal})`
              : ""}</label
          >
        {/each}
      </fieldset>
    </section>
  </div>
  <div>
    <h2>Converted Permissions</h2>
    <fieldset class="converted-perms">
      <label
        >Octal <small>(3 digits of 0-7)</small><input
          type="text"
          bind:value={inputPermissionOctal}
          inputmode="numeric"
          pattern={octalPattern}
          required
          maxlength="3"
          placeholder="000"
          title="Three Octal (0-7) digits"
          aria-invalid={!octalValid}
          spellcheck="false"
          autocomplete="off"
        /></label
      >
      <label
        >Symbolic <small>(3 sets of <code>rwx</code> or <code>-</code> in the pattern)</small><input
          type="text"
          bind:value={inputPermissionBit}
          pattern={symbolicPattern}
          required
          maxlength="9"
          placeholder="---------"
          title="Nine symbols (rwx)"
          class="valid"
          aria-invalid={!symbolicValid}
          spellcheck="false"
          autocomplete="off"
        /></label
      >
    </fieldset>
    <p class="permission-label">Command</p>
    <pre><code>chmod {permissionOctal} /path/to/file.txt</code></pre>
    <p class="permission-label">Human readable:</p>
    <ul>
      {#each permissionGroups as group}
        <li>The {group.title} {@html permissionToText(group)}</li>
      {/each}
    </ul>
  </div>
</div>

<style>
  .permisson-split {
    column-gap: 3rem;
  }
  .group-left {
    display: grid;
    align-items: space-between;
  }

  .permission-groups {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr));
    gap: 1rem;
    justify-items: center;
  }

  .group-title {
    font-size: 1.4rem;
    font-weight: bold;
  }

  .preset-group {
    border: 1px solid var(--pico-form-element-border-color);
    border-radius: var(--pico-border-radius);
    padding: 0.5rem;
    height: fit-content;
    align-self: flex-end;

    & fieldset,
    & fieldset > label:last-child {
      margin-bottom: 0;
    }
  }

  .converted-perms {
    margin-bottom: 0;

    & input {
      font-family: var(--pico-font-family-monospace);
    }
  }

  .permission-label {
    margin-bottom: calc(var(--pico-spacing) * 0.25);
  }

  /* Change valid styles */
  [aria-invalid="false"]:not(select) {
    border-color: var(--pico-form-element-border-color);
    background-image: unset;
  }
</style>
