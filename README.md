# NFT Bridge

This repository serves as the template for bridge. Please read and fallow all instructions in the README as you setup your NFT bridge project.

When you setup your project, please follow the following naming convention for your source repository:

`bootcamp-bridge-{name}-{your github username}`

Please invite the admin team as an administrator on your repo.


## Directory Structure

Your repository should follow the following directory structure. All project code should live in the subdirectory of `project-name` where you replace the placeholder `project-name` with a meaningful name for your project.
```
.
├── .gitignore
├── README.md
└── project-name
    ├── .dockerignore
    ├── .gitignore
    ├── Dockerfile
    ├── Makefile
    └── README.md
```

## Setup

Please install [docker](https://docs.docker.com/get-docker/) on your local machine if you have not already. Please also check that you have `make` correctly installed for your system. Running `make help` with the Makefile in your project directory should show the help text.

You may use whatever local environment setup you would like to run this project. However, we highly suggest using [asdf](https://asdf-vm.com/) as we will be using it for our local environment on the forte project. Documentation for installing asdf can be found [here](https://asdf-vm.com/guide/getting-started.html).
