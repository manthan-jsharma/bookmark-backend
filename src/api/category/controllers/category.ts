/**
 *  category controller
 */
'use strict';

const { categoryController } = require('@strapi/strapi').factories;

module.exports = categoryController('api::category.category', ({ strapi }) => ({
      // Create a category with the current user
  async create(ctx) {
    const { user } = ctx.state;
    const { data } = ctx.request.body;
    
    // Add the current user to the category
    const updatedData = {
      ...data,
      user: user.id,
    };
    
    ctx.request.body = { data: updatedData };
    
    // Create the category
    const response = await super.create(ctx);
    return response;
  },
  
  // Find categories for the current user
  async find(ctx) {
    const { user } = ctx.state;
    
    // Add a filter to only return categories for the current user
    ctx.query.filters = {
      ...(ctx.query.filters || {}),
      user: user.id,
    };
    
    // Call the default find method
    const response = await super.find(ctx);
    return response;
  },
  
  // Find a specific category for the current user
  async findOne(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;
    
    // Find the category
    const category = await strapi.entityService.findOne('api::category.category', id, {
      populate: ['user', 'bookmarks'],
    });
    
    // Check if the category belongs to the current user
    if (!category || category.user.id !== user.id) {
      return ctx.notFound('Category not found');
    }
    
    // Return the category
    return this.transformResponse(category);
  },
  
  // Update a category for the current user
  async update(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;
    
    // Find the category
    const category = await strapi.entityService.findOne('api::category.category', id, {
      populate: ['user'],
    });
    
    // Check if the category belongs to the current user
    if (!category || category.user.id !== user.id) {
      return ctx.notFound('Category not found');
    }
    
    // Update the category
    const response = await super.update(ctx);
    return response;
  },
  
  // Delete a category for the current user
  async delete(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;
    
    // Find the category
    const category = await strapi.entityService.findOne('api::category.category', id, {
      populate: ['user'],
    });
    
    // Check if the category belongs to the current user
    if (!category || category.user.id !== user.id) {
      return ctx.notFound('Category not found');
    }
    
    // Delete the category
    const response = await super.delete(ctx);
    return response;
  },
}));

