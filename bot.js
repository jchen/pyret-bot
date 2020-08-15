const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const { exec } = require('child_process');

bot.login(process.env.BOT_TOKEN); // BOT_TOKEN is the Client Secret

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if (msg.content.startsWith('!pyret') || msg.content.startsWith('!arr')) {
    msg.reply('running code...');
    const input = msg.content.split("```");
    const code = input[1];
    const filename = msg.id + ".arr"

    // Writes Pyret file.
    fs.writeFile(filename, code, function (err) {
      if (err) return console.log(err);
      console.log('Wrote code to .arr file!');
    });

    var outstring = "```";

    // Executes Pyret file.
    exec('pyret ' + filename, (err, stdout, stderr) => {
      if (err) {
        //some err occurred
        console.error(err);
        msg.channel.send(`${err}`.replace(/\n\s*\n/g, '\n'));
      }

      // entire stdout and stderr
      console.log(`${stdout}`);
      msg.channel.send(`${stdout}`.replace(/\r\s*\r/g, '\r'));

      console.log(`${stderr}`);
      msg.channel.send(`${stderr}`.replace(/\r\s*\r/g, '\r'));
    });
  }
});
