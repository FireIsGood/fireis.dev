<script lang="ts">
  type Group = {
    title?: string;
    read: boolean;
    write: boolean;
    execute: boolean;
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
    permission.split;
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
</script>

<h2>Group Permissions</h2>
<section class="permission-groups">
  {#each permissionGroups as group}
    <div>
      <p class="group-title">{group.title}</p>
      <label><input type="checkbox" bind:checked={group.read} />Read</label>
      <label><input type="checkbox" bind:checked={group.write} />Write</label>
      <label><input type="checkbox" bind:checked={group.execute} />Execute</label>
    </div>
  {/each}
</section>
<h2>Converted Permissions</h2>
<fieldset class="converted-perms">
  <label
    >Octal<input
      type="text"
      bind:value={inputPermissionOctal}
      inputmode="numeric"
      pattern={octalPattern}
      required
      maxlength="3"
      placeholder="000"
      title="Three Octal (0-7) digits"
      aria-invalid={!octalValid}
    /></label
  >
  <label
    >Symbolic<input
      type="text"
      bind:value={inputPermissionBit}
      pattern={symbolicPattern}
      required
      maxlength="9"
      placeholder="---------"
      title="Nine symbols (rwx)"
      class="valid"
      aria-invalid={!symbolicValid}
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

<style>
  .permission-groups {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(6rem, 1fr));
    gap: 1rem;
    justify-items: center;
  }

  .group-title {
    font-size: 1.4rem;
    font-weight: bold;
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
