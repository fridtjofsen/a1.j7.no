const { BskyAgent } = require('@atproto/api');

class BlueskyService {
  constructor() {
    this.agent = new BskyAgent({
      service: 'https://bsky.social'
    });
    this.authenticated = false;
    // User provided BLUESKY_USERNAME, BLUESKY_EMAIL, BLUESKY_PASSWORD
    this.identifier = process.env.BLUESKY_USERNAME || process.env.BLUESKY_EMAIL;
    this.password = process.env.BLUESKY_PASSWORD;
  }

  async login() {
    if (this.authenticated) {
      return true;
    }

    if (!this.identifier || !this.password) {
        console.log('Bluesky credentials not provided');
        return false;
    }

    try {
      await this.agent.login({
        identifier: this.identifier,
        password: this.password
      });
      this.authenticated = true;
      console.log('Logged in to Bluesky successfully');
      return true;
    } catch (error) {
      console.error('Failed to login to Bluesky:', error);
      return false;
    }
  }

  async post(text) {
    const isLoggedIn = await this.login();
    if (!isLoggedIn) return { success: false, error: 'Login failed' };

    try {
      const record = {
        text: text,
        createdAt: new Date().toISOString()
      };

      const response = await this.agent.post(record);
      console.log('Posted to Bluesky successfully:', response.uri);
      return { success: true, uri: response.uri };
    } catch (error) {
      console.error('Error posting to Bluesky:', error);
      return { success: false, error };
    }
  }
}

module.exports = BlueskyService;
