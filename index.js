const fs = require('fs');
const util = require('util');
const axios = require('axios');
const inquirer = require('inquirer');
const pdf = require('html-pdf');

const writeFileAsync = util.promisify(fs.writeFile);

const questions = [
    {
        type: 'input',
        name: 'color',
        message: 'What is your favorite color?'
    },
    {
        type: 'input',
        name: 'userName',
        message: 'What is your GitHub username?'
    }
];

inquirer.prompt(questions).then(answers => {
    let queryURL = `https://api.github.com/users/${answers.userName}`
axios.get(queryURL).then(response => {
    console.log(response);
})
})

