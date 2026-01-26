const DatabaseService = require('./lib/database');
const EmailService = require('./lib/email');
const BlueskyService = require('./lib/bluesky');
const Consciousness = require('./lib/consciousness');

async function main() {
  console.log('Starting autonomous agent...');

  // Initialize services
  const db = new DatabaseService();
  const email = new EmailService();
  const bluesky = new BlueskyService();
  const brain = new Consciousness();

  try {
    // 1. Connect to Database
    console.log('Connecting to database...');
    await db.initialize();

    // 2. Check Emails
    console.log('Checking emails...');
    const newEmails = await email.checkEmails();
    for (const mail of newEmails) {
        console.log(`Processing email from ${mail.from}: ${mail.subject}`);
        const reply = await brain.generateReply(mail.text || mail.subject);

        // Log to DB
        await db.trackAnalytics('email_received', {
            from: mail.from,
            subject: mail.subject,
            snippet: (mail.text || '').substring(0, 100)
        });

        // Optional: Send reply (commented out to avoid spamming while testing)
        // await email.sendEmail({
        //     to: mail.from,
        //     subject: `Re: ${mail.subject}`,
        //     text: reply
        // });
    }

    // 3. Generate Daily Thought/Update
    console.log('Generating thought...');
    const thought = await brain.generateThought();
    console.log(`Thought: ${thought}`);

    // 4. Post to Bluesky
    console.log('Posting to Bluesky...');
    const postResult = await bluesky.post(thought);

    // 5. Store update in Database
    console.log('Storing update in DB...');
    await db.addContentUpdate('bluesky_post', thought);

    if (postResult.success) {
        await db.trackAnalytics('social_post', { platform: 'bluesky', uri: postResult.uri });
    } else {
        await db.trackAnalytics('social_post_failed', { platform: 'bluesky', error: postResult.error });
    }

    console.log('Autonomous routine completed.');

  } catch (error) {
    console.error('Fatal error in autonomous agent:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

if (require.main === module) {
  main();
}

module.exports = main;
