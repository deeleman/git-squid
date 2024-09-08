# GitSquid

<p align="center">
  <img src="https://github.com/user-attachments/assets/946604ac-215a-4489-a890-9478e2a2112c" alt="GitSquid" width="160" />
</p>

**Introducing GitSquid** – the ultimate desktop application for developers and project managers looking to monitor and manage repositories with ease and security. Designed with cutting-edge features, GitSquid not only enhances productivity but also ensures that your personal data and usage history are fully protected. With an intuitive interface and robust functionality, managing repository issues has never been this simple or secure.

<img width="1450" alt="Screenshot 2024-09-06 at 02 32 27" src="https://github.com/user-attachments/assets/8e942ebb-7a0b-4f0b-b7c7-fa9517f745d5">



## Key Features
- **Effortless Configuration:** GitSquid provides a visual interface that allows you to easily configure and update your personal token and monitored repository. No more hassle with manual setups – everything is streamlined for convenience from the first time you open the application.

- **Multiple repositories support:** GitSquid empowers you to effortlessly track and manage issues across multiple GitHub repositories, all in one intuitive platform. Stay organized and enhance productivity with real-time monitoring and updates..

- **Advanced Encryption:** Your privacy is a top priority and that's why GitSquid uses AES-256 symmetric encryption to securely persist all your personal data, ensuring that your sensitive information remains safe, both during usage and after.

- **Responsive data fetching** GitSquid keeps track of your viewing progress and will fetch additional content whenever available as you scroll the issues list. Moreover, you can ping the GitHub services anytime to also fetch the latest issues created during your session.

- **Persistent Issue Tracking:** You'll never lose track of what you’ve read! GitSquid keeps track of read issues, even after you close the app, offering a seamless experience when you return. It’s designed for a better user experience, reducing redundant work and improving focus.

- **Powerful Filtering and Metadata:** GitSquid's advanced UI allows you to not only view issues but also filter them by keyword and examine detailed metadata. Whether you're searching for specific issues or need an overview of the project’s health, GitSquid provides everything you need at your fingertips.

- **Markdown and Media Support:** Issues are rendered with full Markdown support, and even include user-uploaded images to keep full consistency with the information available in GitHub.

Experience the future of repository management with GitSquid – secure, smart, and user-friendly.

![Screenshot 2024-09-06 at 02 16 19](https://github.com/user-attachments/assets/5957f224-f68f-4d5f-8fcb-bde00bd17546)


## Project setup for developers

> [!WARNING]  
> The minimum requirements for running this project, either on development or production mode, are `node v18.20.4` and `npm v.8.19.2`, or later versions. As a rule of thumb the guidance is to use the latest [LTS versions](https://nodejs.org/).

### Installing dependencies

The first step for implementing a development sandbox is to install the project dependencies. You can use `yarn`, `npm` or any other NodeJS package manager of your choice.

```bash
$ yarn
```

### Developing GitSquid features

GitSquid is built on top of a project bootstrapped with [Electron Vite](https://electron-vite.org/). You can spawn a development environment with hot-module-replacement support by running the following.

```bash
$ yarn dev
```

### Building GitSquid for distribution

> [!WARNING]  
> Currently the project lacks a packaging manager library, hence building the project might lead to limited resources.


```bash
# For windows
$ yarn build:win

# For macOS
$ yarn build:mac

# For Linux
$ yarn build:linux
```

## Roadmap

Here's a look at the upcoming enhancements and fixes planned for GitSquid to ensure it remains a powerful and reliable tool for repository management:

- **Integrating a packaging manager:** A smooth experience upon installing and executing the application as an end-user is top of mind at this moment, enhancing product distribution and branding with actual icons depicting the product identity.

- **Adding Unit Tests:** Comprehensive unit tests will be implemented across the application to ensure each individual component functions correctly and consistently, increasing overall stability.

- **Adding End-to-End (E2E) Tests:** To further enhance the reliability of GitSquid, there is a plan to introduce E2E tests to simulate real user interactions. This will allow catching issues before they impact users and ensure a seamless experience.

- **Improving Text Rendering with Markdown:** We’re working on enhancing the text rendering mechanism to expand options and prevent reading issues when content exceeds the viewport. This will improve the readability and presentation of formatted text, offering a smoother experience for users working with markdown in their repositories.

These updates are part of GitSquid's strategy and ongoing commitment to delivering a robust and user-friendly issue monitoring tool.


## Distributed under the MIT License

Copyright 2024 Pablo Deeleman

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
