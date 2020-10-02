const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');

bot.login(process.env.BOT_TOKEN); // BOT_TOKEN is the Client Secret

bot.on('ready', () => {
  // Logs that bot is online.
  console.info(`Logged in as ${bot.user.tag}!`);

  // Sets status.
  bot.user.setPresence({ activity: { name: 'with caterpillars (!arr)' }, status: 'available' })
  .then(console.log)
  .catch(console.error);

  // Runs a test program to itialize the instance of Pyret.
  const { exec } = require('child_process');
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

    // Wraps code execution and parsing within reply promise to eliminate blocking
    msg.reply('running code...').then(function(reply, _) {

      // Reply content.
      var content = reply.content;

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
      const { exec } = require('child_process');
      exec(`pyret ${filename}`, (err, stdout, stderr) => {
        if (err) {
          // some error occurred
          console.error(err);
          if (`${err}`.length > 0) {
            content += `\`\`\`${err}\`\`\``;
            reply.edit(content);
          }
        }

        // entire stdout and stderr
        console.log(`${stdout}`);
        if (`${stdout}`.length > 0) {
          content += `\`\`\`${stdout}\`\`\``;
          reply.edit(content);
        }

        console.log(`${stderr}`);
        if (`${stderr}`.length > 0) {
          content += `\`\`\`${stderr}\`\`\``;
          reply.edit(content);
        }

        // Edits the reply message status.
        content = content.replace('running code...', 'code execution complete!');
        reply.edit(content);
      });
    });
  }
});
