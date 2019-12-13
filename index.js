const fs = require('fs');
const util = require('util');
const axios = require('axios');
const inquirer = require('inquirer');
const HTML5ToPDF = require("html5-to-pdf")
const path = require("path")

const writeFileAsync = util.promisify(fs.writeFile);


class DoHomework {

    constructor() {
        this.userName = null;
        this.color = null;
    }

    promptUser() {

        return inquirer.prompt([
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
        ]).then(answers => {
            this.userName = answers.userName;
            this.color = answers.color;
            this.makeApiRequest();
        })
    }

    makeApiRequest() {
        return Promise.all([axios.get(`https://api.github.com/users/${this.userName}`), axios.get(`https://api.github.com/users/${this.userName}/starred`)])
            .then(([{ data: { avatar_url, location, name, blog, bio, public_repos, followers, following, html_url } }, { data: { length } }]) => {
                this.avatar_url = avatar_url;
                this.location = location;
                this.html_url = html_url;
                this.name = name;
                this.blog = blog;
                this.bio = bio;
                this.public_repos = public_repos;
                this.followers = followers;
                this.following = following;
                this.stars = length;
                this.createHtml();
            })
    }

    async createHtml() {
       await  writeFileAsync('profile.html',`
        <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="./assets/style.css">
    <title>Document</title>
</head>

<body style='background-color: ${this.color}'>
    <img src='${this.avatar_url}' class="rounded-circle" style="height: 200px;" id='profileImg'>
    <div class="container">
        <div class="jumbotron text-center">
            <h1>${this.name}</h1>
            <span>${this.location} | <a href='${this.html_url}'>GitHub</a> | <a href='${this.blog}'>Website</a> </span>
        </div>
    </div>
    <div class="container">
        <div class="jumbotron text-center">
            <h3>${this.bio}</h3>
            <div class="card-deck">
                <div class="card bg-light mb-3" style="max-width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">Public Repositories</h5>
                        <p class="card-text">
                            ${this.public_repos}
                        </p>
                    </div>
                </div>
                <div class="card bg-light mb-3" style="max-width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">Followers</h5>
                        <p class="card-text">
                            ${this.followers}
                        </p>
                    </div>
                </div>
                <div class="card bg-light mb-3" style="max-width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">Following</h5>
                        <p class="card-text">
                            ${this.following}
                        </p>
                    </div>
                </div>
                <div class="card bg-light mb-3" style="max-width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">Github Stars</h5>
                        <p class="card-text">
                            ${this.stars}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>
    `)
    await this.createPdf();
    }

    async createPdf(){
        const html5ToPDF = new HTML5ToPDF({
            inputPath: path.join('./', "profile.html"),
            outputPath: path.join('./', "profile.pdf"),
            templatePath: path.join('./', "templates", "htmlbootstrap"),
            include: [
                path.join('./', "assets", "style.css"),
            ],
            options: {
                printBackground: true,
            }
        })
    
        await html5ToPDF.start()
        await html5ToPDF.build()
        await html5ToPDF.close()
        console.log("DONE")
        process.exit(0)
       
    }
}

var newHomework = new DoHomework();
newHomework.promptUser();