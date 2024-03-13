// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    deno: {
      test: true,
    },
    crypto: true,
  },
  compilerOptions: {
    lib: ["esnext", "dom"],
  },
  package: {
    name: "@jmondi/string-encrypt-decrypt",
    version: Deno.args[0]?.replace("v", ""),
    description: "Encrypt and decrypt strings using crypto",
    author: "Jason Raimondi <jason@raimondi.us>",
    license: "MIT",
    engines: {
      node: ">=20.0.0",
    },
    repository: {
      type: "git",
      url: "git+https://github.com/jasonraimondi/ts-string-encrypt-decrypt.git",
    },
    bugs: {
      url: "https://github.com/jasonraimondi/ts-string-encrypt-decrypt/issues",
    },
  },
  postBuild() {
    Deno.writeTextFileSync(
      "npm/.npmignore",
      "esm/testdata/\nscript/testdata/\n",
      { append: true },
    );
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
