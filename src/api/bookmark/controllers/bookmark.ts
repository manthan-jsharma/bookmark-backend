/**
 *  about controller
 */
'use strict';

const { bookmarkController } = require('@strapi/strapi').factories;

module.exports = bookmarkController('api::bookmark.bookmark', ({ strapi }) => ({
     // Create a bookmark with the current user
  async create(ctx) {
    const { user } = ctx.state;
    const { data } = ctx.request.body;
    
    // Add the current user to the bookmark
    const updatedData = {
      ...data,
      user: user.id,
    };
    
    // Create the bookmark
    const response = await super.create(ctx);
    return response;
  },
  
  // Find bookmarks for the current user
  async find(ctx) {
    const { user } = ctx.state;
    
    // Add a filter to only return bookmarks for the current user
    ctx.query.filters = {
      ...(ctx.query.filters || {}),
      user: user.id,
    };
    
    // Call the default find method
    const response = await super.find(ctx);
    return response;
  },
  
  // Find a specific bookmark for the current user
  async findOne(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;
    
    // Find the bookmark
    const bookmark = await strapi.entityService.findOne('api::bookmark.bookmark', id, {
      populate: ['category', 'user'],
    });
    
    // Check if the bookmark belongs to the current user
    if (!bookmark || bookmark.user.id !== user.id) {
      return ctx.notFound('Bookmark not found');
    }
    
    // Return the bookmark
    return this.transformResponse(bookmark);
  },
  
  // Update a bookmark for the current user
  async update(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;
    
    // Find the bookmark
    const bookmark = await strapi.entityService.findOne('api::bookmark.bookmark', id, {
      populate: ['user'],
    });
    
    // Check if the bookmark belongs to the current user
    if (!bookmark || bookmark.user.id !== user.id) {
      return ctx.notFound('Bookmark not found');
    }
    
    // Update the bookmark
    const response = await super.update(ctx);
    return response;
  },
  
  // Delete a bookmark for the current user
  async delete(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;
    
    // Find the bookmark
    const bookmark = await strapi.entityService.findOne('api::bookmark.bookmark', id, {
      populate: ['user'],
    });
    
    // Check if the bookmark belongs to the current user
    if (!bookmark || bookmark.user.id !== user.id) {
      return ctx.notFound('Bookmark not found');
    }
    
    // Delete the bookmark
    const response = await super.delete(ctx);
    return response;
  },
}));
