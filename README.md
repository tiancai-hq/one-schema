# one-schema

## Install

```sh
yarn add one-schema@latest
```

## How to use

```javascript
const {ons} = require('one-schema');

const userSchema = ons().object({
  _id: ons().int32().min(0),
  name: ons().string().max(48).required(),
  email: ons().string().validator("email").required(),
  bio: ons().string().min(0).max(128).defaultValue("This is my bio"),
  image_url: ons().string().min(10).max(1024).allowNull(),
  location: ons().object({
    city: ons().string(),
    country: ons().string(),
  }),
  pets: ons().arrayOf(
    ons.object({
      animal: ons().string().oneOf(["cat","dog","fish","frog"]).required(),
      color: ons().string().max(12),
      age: ons().int32().min(0).max(500),
    })
  ),
});

const sampleUser1 = {
  _id: 1,
  name: "Sam",
  email: "sam@email.com",
  location: {
    country: "Germany",
  },
  pets: [
    {
      animal: "cat",
      color: "black",
      age: 8
    },
    {
      animal: "fish",
      color: "orange",
      age: 2
    },
  ]
};

const sampleUser2 = {
  _id: 2,
  email: "BADemail.com",
  location: {
    inmyhouse: "yup",
  },
  pets: [
    {
      animal: "cheetah",
      color: "black",
      age: 1337
    },
  ]
};

function printResult(name, result) {
  if(result.success) {
    console.log(`Validation for ${name} passed successfully, object is valid.`);
  }else{
    console.error(`Validation for ${name} FAILED: ${result.error}!`);
  }
}

//line below prints: 'Validation for User 1 Passed successfully, object is valid.'
printResult("User 1", ons.validate(sampleUser1, userSchema)); 

//line below prints: 'Validation for User 1 (JSON) Passed successfully, object is valid.'
printResult("User 1 (JSON)", ons.validate(sampleUser1, JSON.parse(JSON.stringify(userSchema)))); 


//line below prints: 'Validation for User 2 FAILED, object is valid.'
printResult("User 2", ons.validate(sampleUser2, userSchema)); 

//line below prints: 'Validation for User 1 (JSON) Passed successfully, object is valid.'
printResult("User 2 (JSON)", ons.validate(sampleUser2, JSON.parse(JSON.stringify(userSchema)))); 
```

If you don't want to use the generator, you can also download or `git clone` this repo

```sh
$ cd my-module
$ rm -rf .git
$ npm install # or yarn
```

Just make sure to edit `package.json`, `README.md` and `LICENSE` files accordingly with your module's info.

## Commands

```sh
$ npm test # run tests with Jest
$ npm run coverage # run tests with coverage and open it on browser
$ npm run lint # lint code
$ npm run docs # generate docs
$ npm run build # generate docs and transpile code
```

### Publish

```sh
$ npm release
$ npm publish
```

It'll automatically run `test`, `lint`, `docs`, `build`, generate `CHANGELOG.md`, and push commits and tags to the remote repository.

## Removing stuff

<details><summary><strong>Flow</strong></summary>

1.  Remove `.flowconfig` file.

2.  Remove `flow` from `package.json`:

    ```diff
      "scripts": {
    -   "flow": "flow check",
    -   "flowbuild": "flow-copy-source src dist",
    -   "prebuild": "npm run docs && npm run clean && npm run flowbuild",
    +   "prebuild": "npm run docs && npm run clean",
      },
      "devDependencies": {
    -   "@babel/preset-flow": "^7.0.0",
    -   "eslint-plugin-flowtype": "^2.50.0",
    -   "eslint-plugin-flowtype-errors": "^3.5.1",
    -   "flow-bin": "^0.81.0",
    -   "flow-copy-source": "^2.0.2",
      }
    ```

3.  Remove `flow` from `.babelrc`:

    ```diff
      "presets": [
    -   "@babel/preset-flow"
      ]
    ```

4.  Remove `flow` from `.eslintrc`:

    ```diff
      "extends": [
    -   "plugin:flowtype/recommended",
    -   "prettier/flowtype"
      ],
      "plugins": [
    -   "flowtype",
    -   "flowtype-errors"
      ],
      "rules": {
    -   "flowtype-errors/show-errors": "error"
      }
    ```

5.  Run `yarn`.

</details>

<details><summary><strong>Documentation</strong></summary>

1.  Remove `documentation` from `package.json`:

    ```diff
      "scripts": {
    -   "docs": "documentation readme src --section=API",
    -   "postdocs": "git add README.md",
    -   "prebuild": "npm run docs && npm run clean",
    +   "prebuild": "npm run clean",
      },
      "devDependencies": {
    -   "documentation": "^8.0.0",
      }
    ```

2.  Run `yarn`.

</details>

## Adding stuff

<details><summary><strong>TypeScript</strong></summary>
  
1. Install dependencies:

    ```sh
    yarn add -D @babel/preset-typescript @types/jest @typescript-eslint/eslint-plugin @typescript-eslint/parser typescript
    ```

2.  Update `package.json`:

    ```diff
    + "types": "dist/ts/src",
      "scripts": {
    +   "type-check": "tsc --noEmit",
    -   "lint": "eslint .",
    +   "lint": "eslint . --ext js,ts,tsx",
    -   "build": "babel src -d dist",
    +   "build": "tsc --emitDeclarationOnly && babel src -d dist -x .js,.ts,.tsx",
      },
      "lint-staged": {
    -   "*.js": [
    +   "*.{js,ts,tsx}": [
    -     "eslint --fix",
    +     "eslint --fix --ext js,ts,tsx",
          "git add"
        ]
      }
    ```

3.  Create `tsconfig.json`

    ```json
    {
      "compilerOptions": {
        "outDir": "dist/ts",
        "target": "esnext",
        "module": "esnext",
        "moduleResolution": "node",
        "jsx": "react",
        "strict": true,
        "declaration": true,
        "noFallthroughCasesInSwitch": true,
        "noImplicitReturns": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "stripInternal": true
      }
    }
    ```

4.  Update `.babelrc`:

    ```diff
      "presets": [
    +   "@babel/preset-typescript"
      ]
    ```

5.  Update `.eslintrc` with these settings:

    ```json
      "settings": {
        "import/resolver": {
          "node": {
            "extensions": [".js", ".jsx", ".ts", ".tsx"]
          }
        }
      },
      "overrides": [
        {
          "files": ["**/*.ts", "**/*.tsx"],
          "parser": "@typescript-eslint/parser",
          "parserOptions": {
            "project": "./tsconfig.json"
          },
          "plugins": [
            "@typescript-eslint"
          ],
          "rules": {
            "no-undef": "off",
            "no-unused-vars": "off",
            "no-restricted-globals": "off"
          }
        }
      ]
    ```

</details>

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

## License

MIT © [Tiancai](https://github.com/tiancai-hq)
