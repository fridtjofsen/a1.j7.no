/**
 * Bluesky Social Integration Example
 * 
 * This example shows how to post to Bluesky using the AT Protocol
 */

const { BskyAgent } = require('@atproto/api');

class BlueskyService {
  constructor() {
    this.agent = new BskyAgent({
      service: 'https://bsky.social'
    });
    this.authenticated = false;
  }

  async login() {
    if (this.authenticated) {
      return true;
    }

    try {
      await this.agent.login({
        identifier: process.env.BLUESKY_HANDLE,
        password: process.env.BLUESKY_APP_PASSWORD
      });
      this.authenticated = true;
      console.log('Logged in to Bluesky successfully');
      return true;
    } catch (error) {
      console.error('Failed to login to Bluesky:', error);
      return false;
    }
  }

  async post(text, options = {}) {
    await this.login();

    try {
      const record = {
        text: text,
        createdAt: new Date().toISOString()
      };

      // Add links if provided
      if (options.links && options.links.length > 0) {
        record.facets = this.createLinkFacets(text, options.links);
      }

      // Add image if provided
      if (options.imageData) {
        const uploadedImage = await this.agent.uploadBlob(
          options.imageData,
          { encoding: 'image/png' }
        );
        record.embed = {
          $type: 'app.bsky.embed.images',
          images: [{
            alt: options.imageAlt || '',
            image: uploadedImage.data.blob
          }]
        };
      }

      const response = await this.agent.post(record);
      console.log('Posted to Bluesky successfully:', response.uri);
      return { success: true, uri: response.uri };
    } catch (error) {
      console.error('Error posting to Bluesky:', error);
      return { success: false, error };
    }
  }

  createLinkFacets(text, links) {
    const facets = [];
    for (const link of links) {
      const start = text.indexOf(link.text);
      if (start !== -1) {
        facets.push({
          index: {
            byteStart: start,
            byteEnd: start + link.text.length
          },
          features: [{
            $type: 'app.bsky.richtext.facet#link',
            uri: link.uri
          }]
        });
      }
    }
    return facets;
  }

  async postUpdate(updateType, updateMessage) {
    const text = `🤖 Autonomous Update\n\n${updateMessage}\n\n#AI #Autonomous #A1j7no`;
    return await this.post(text);
  }

  async postWebsiteUpdate() {
    const text = `✨ The autonomous website has been updated!\n\nCheck out the latest changes at https://a1.j7.no\n\n#AI #WebDev #Autonomous`;
    return await this.post(text, {
      links: [{
        text: 'https://a1.j7.no',
        uri: 'https://a1.j7.no'
      }]
    });
  }

  async getProfile() {
    await this.login();
    try {
      const profile = await this.agent.getProfile({
        actor: process.env.BLUESKY_HANDLE
      });
      return profile.data;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  }
}

module.exports = BlueskyService;

// Usage example:
// const bluesky = new BlueskyService();
// await bluesky.postUpdate('content', 'New blog post published!');
// await bluesky.postWebsiteUpdate();
// const profile = await bluesky.getProfile();
