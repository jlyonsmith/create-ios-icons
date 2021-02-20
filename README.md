# Node.js/TypeScript CLI Tool

![GitHub package.json version](https://img.shields.io/github/package-json/v/jlyonsmith/create-ios-icons) ![Code coverage](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/jlyonsmith/create-ios-icons/master/coverage.json) [![npm](https://img.shields.io/npm/dm/@johnls/create-ios-icons)](https://www.npmjs.com/package/@johnls/create-ios-icons) [![GitHub](https://img.shields.io/github/license/jlyonsmith/create-ios-icons)](https://raw.githubusercontent.com/jlyonsmith/create-ios-icons/master/LICENSE)

## Overview

This is a tool for creating all the different iOS icon sizes from a PDF template file.

## Installation

```sh
npm install -g @johnls/create-ios-icons
```

## Usage

```sh
create-ios-icons MyIcon.pdf MyIcon-Test.pdf Project/Assets.xcassets
```

This will create icon sets called `MyIcon` and `MyIcon-Test` in the `Project/Assets.xcassets` directory. Any existing assets will be overwritten.
