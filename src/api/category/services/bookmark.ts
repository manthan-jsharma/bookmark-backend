const { createCoreService } = require('@strapi/strapi').factories;
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = createCoreService('api::bookmark.bookmark', ({ strapi }) => ({
  // Extend the default service with custom methods
  async getFavicon(url) {
    try {
      // Try to fetch the page
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      
      // Look for favicon in different locations
      const favicon = $('link[rel="icon"]').attr('href') || 
                     $('link[rel="shortcut icon"]').attr('href') || 
                     $('link[rel="apple-touch-icon"]').attr('href');
      
      if (favicon) {
        // Handle relative URLs
        if (favicon.startsWith('/')) {
          const urlObj = new URL(url);
          return `${urlObj.protocol}//${urlObj.host}${favicon}`;
        }
        return favicon;
      }
      
      // Default to favicon.ico
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.host}/favicon.ico`;
    } catch (error) {
      console.error('Error fetching favicon:', error);
      return null;
    }
  },
  
  // Override the create method to automatically fetch favicon
  async create(data) {
    // Try to fetch the favicon
    if (data.url) {
      const favicon = await this.getFavicon(data.url);
      if (favicon) {
        data.favicon = favicon;
      }
    }
    
    // Call the default create method
    return await super.create(data);
  },
}));