# FireIsREADME

![GitHub License](https://img.shields.io/github/license/fireisgood/fireis.dev?style=flat-square&color=a31f34)
![GitHub last commit](https://img.shields.io/github/last-commit/fireisgood/fireis.dev?style=flat-square)
![Website](https://img.shields.io/website?url=http%3A%2F%2Ffireis.dev&style=flat-square)

My website!

This is just the code behind it. You can check it out at [fireis.dev](https://fireis.dev/) to see what this actually is.
I'm not sure why you would want to look here, but I hope you find what you seek!

Project structure:

```text
public/
├── fonts/
└── rss/
src/
├── components/
├── content/
│   └── blog/
├── images/
├── layouts/
├── pages/
│   ├── blog/
│   └── tools/
└── styles/
```

This site is created with [Astro](https://astro.build/) with many styles from [Pico CSS](https://picocss.com/). I am
currently hosting it through GitHub Pages via an [Action](.github/workflows/deploy.yml).

## Installation

<details>
<summary>I mean like, if you really want to...</summary>

### Prerequisites

Read the [Astro quick start guide's prerequisite list](https://docs.astro.build/en/install/manual/#prerequisites).

This project uses pnpm, though you can use npm if you wish. You can check that pnpm/npm is installed in the terminal by
running:

```bash
# Using pnpm
pnpm -v

# Using npm
npm -v
```

### Setup

First,
[fork the repo](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo).

Once the prerequisites are installed and you are working off the fork,
[clone the repository](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository)
to your local machine.

This can be done from the command line:

```bash
git clone git@github.com:FireIsGood/fireis.dev.git ./fireiswebsite
```

### Local Development

You can run the development server through the terminal.

From the command line:

```bash
# Default port 1625
pnpm dev
```

When Astro is done setting up, you should see a success message.

```bash
┃ Local    http://localhost:1625/
┃ Network  use --host to expose
```

There are additional commands you can run from the terminal:

| Command                | Action                                                  |
| :--------------------- | :------------------------------------------------------ |
| `pnpm install`         | Installs dependencies                                   |
| `pnpm start`           | Starts local dev server at `localhost:1625`             |
| `pnpm dev`             | Starts local dev server at `localhost:1625` and open it |
| `pnpm build`           | Build your production site to `./dist/`                 |
| `pnpm preview`         | Preview your build locally, before deploying            |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check`        |
| `pnpm astro -- --help` | Get help using the Astro CLI                            |

</details>

## Contributing

Feel free to add Issues if you see anything wrong.

This is my personal blog, so I will not accept pull requests.

## License

[MIT](https://choosealicense.com/licenses/mit/)
