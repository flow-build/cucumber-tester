# Flowbuild Tests with Cucumber

This repo is a sample to build tests for flowbuild workflows using Cucumber notation.

The objective is to provide a set of steps definitions so the user can focus on writing the features itself.

## How to use

This repository is **not** yet available as npm package, so in order to use it, you need to clone this repo.

- [x] Clone this repo
- [x] Execute ```npm install```
- [x] Add a .env file, with at least the variable ```FLOWBUILD_URL```
- [x] Add feature files to the folder ```/features/```
- [x] Execute ```npm run tests```

> :warning: Note to windows users
> Cucumber does not run on windows terminals, in order to run this project on windows you must use a WSL Ubuntu terminal with node installed.

## Writing Features

Assuming you are already familiar to the [Gherkin](https://cucumber.io/docs/gherkin/) notation, in this repo we defined some commom steps definitions used to tests flowbuild workflows.

#### Create a token

This step commands the test to generate a generic token - assuming the default flowbuild implementation. If your flowbuild implementation has a customized authentication route, you should adjust the step definition and/or the [auth](#Customizing).

The available quotes to create a token are:
- *Given* the default user is logged in
- *Dado* que o usuario padrao esta logado

#### Start a process

This step commands the test to start a certain workflow with the provided inital data. The available quotes to identify this step are:

- (English) *Given* a '**workflow name**' process started with the initial data of '**initial data**'
- (Portuguese) *Dado* que um processo de '**workflow name**' foi iniciado com os dados iniciais '**initial bag**'

The initial data should be a stringified JSON object.

#### Submits a userTask

This step commands the test to submit a userTask with a specific payload.

- (English) *When* the user submits '**payload**'
- (Portuguese) *Quando* o usuário submete '**payload**'

The payload should be a stringified JSON object.

#### Check whether a process has stopped at a certain userTask

With this step the test will check the process state until it reaches a *waiting* status. Then the test will check whether the expected node is the correct ont. If this happens the test will grab the activity manager id so the userTask can be submitted.

- (English) *Then* the process waits at '**node id**'
- (Portuguese) *Entao* o processo para no nó '**node id**'

#### Check whether a process has finished

Just like the case above, but stopping at *finished* status.

- (English) *Then* the process finishes at '**node id**'
- (Portuguese) *Entao* o processo finaliza no nó '**node id**'

#### Check whether a process passed thru a certain node

This step checks if the process has passed thru a certain node (and how many times). It is recommended to use this condition only if you already guaranteed the process has stopped.

- (English) *Then* the process should have passed N times thru node '**node id**'
- (Portuguese) *Entao* o processo deve ter passado N vezes pelos pelo nó '**node id**'

> :warning: **Note**
> This condition checks how may states were created to a specific node, remind that start nodes, timer nodes, user tasks and subprocess nodes can generate 2 states.

### Example

```markdown
Feature: aWorkflow

  Scenario: empty submit
    Given the default user is logged in
    Given a 'aWorkflow' process started with the initial data of '{ name: 'any' }'
    Then the process waits at '1-2'
    When the user submits '{ action: 'some' }'
    Then the process finishes at '1-99'
    Then the process should have passed 2 times thru node '1-1'
```

## Customizing

Usually, when flowbuild implementations changes how tokens are generated and/or how users authenticate. This means you may need to customize the method used to generate a token and/or add specific steps to generate different types of actors.

In order to do that, your can modify the file 

    /features/support/steps.js
    
adding new quotes to represent new steps and/or you can change the file 

    /features/support/auth.js

to represent the routes to generate a token or authenticate an user.