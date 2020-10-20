const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');

bot.login(process.env.BOT_TOKEN); // BOT_TOKEN is the Client Secret

bot.on('ready', () => {
    // Logs that bot is online.
    console.info(`Logged in as ${bot.user.tag}!`);

    // Sets status.
    bot.user.setPresence({activity: {name: 'with caterpillars (!arr)'}, status: 'available'})
        .then(console.log)
        .catch(console.error);

    // Runs a test program to initialize the instance of Pyret.
    const {exec} = require('child_process');
    exec(`pyret test.arr`, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
        }
        console.log("Pyret initialized!")
    });
});

bot.on('message', msg => {
    // Checks if message starts with !pyret or !arr
    if (msg.content.startsWith('!pyret') || msg.content.startsWith('!arr')) {

        // Rich reply message
        var replyMessage = new Discord.MessageEmbed()
            .setColor('#ff7f00')
            .setTimestamp()
            .setFooter(`Pyret Bot invocated by ${msg.author.username}`, 'https://pyret.cs.brown.edu/img/pyret-logo.png')
            .setTitle('Executing code...')

        // Wraps code execution and parsing within reply promise to eliminate blocking
        msg.reply("", replyMessage).then(function (reply, _) {
            // Parses input.
            const input = msg.content.split("```");
            const code = input[1] + "\nprint(\'\\n\')"; // Adds a line break for better print statements
            const filename = msg.id + ".arr";

            // Writes Pyret file.
            fs.writeFile(filename, code, function (err) {
                if (err) return console.log(err);
                console.log('Wrote code to .arr file!');
            });

            // Executes Pyret file by spawning child shell process.
            const {exec} = require('child_process');
            exec(`pyret ${filename}`, (err, stdout, stderr) => {
                if (err) {
                    // some error occurred
                    console.error(err);
                    // Adds a field displaying error
                    if (`${err}`.length > 0) {
                        replyMessage = replyMessage
                            .addField('Errors', `\`\`\`${err}\`\`\``, false)
                    }
                }

                // Outputs pretty stdout if no stderr
                console.log(`${stderr}`);
                // Adds a field displaying stderr
                if (`${stderr}`.length > 0) {
                    replyMessage = replyMessage
                        .addField('Errors', `\`\`\`${stderr}\`\`\``, false)
                } else {
                    console.log(`${stdout}`);
                    if (`${stdout}`.length > 0) {
                        // Gets actual useful output
                        const output = stdout.trim().split("Cleaning up and generating standalone...")
                            .pop().replace(/\n.*$/, '').trim()
                        // Adds a field displaying output
                        if (output.length > 0) {
                            replyMessage = replyMessage
                                .addField('Output', `\`\`\`${output}\`\`\``, false)
                        }
                        // Gets last line of output, which is the tests result
                        const testsString = stdout.replace("\r", "\n").trim().split("\n").pop();
                        console.log(testsString)
                        // Adds a field displaying tests
                        if (testsString.length > 0) {
                            replyMessage = replyMessage
                                .addField('Tests', testsString, false)
                        }
                    }
                }

                // Edits the reply message status.
                // content = content.replace('running code...', 'code execution complete!');
                replyMessage = replyMessage
                    .setTitle('Code execution complete!')
                    .setColor('#0099ff')
                reply.edit(replyMessage);
            });
        });
    }
});
