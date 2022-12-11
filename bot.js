const Telegraf = require('telegraf')
const session = require('telegraf/session')
const scenes = require('./scenes')
const Stage = require('telegraf/stage')
const express = require('express')
const { enter, leave } = Stage


const token = "486055194:AAFDXeJaLlWS4jLviVy0ByBdiEG1wNlEzwI";
const bot = new Telegraf(token, { handlerTimeout: 3000 })


const stage = new Stage([scenes.languageScene, scenes.mainScene, scenes.categoriesScene, scenes.productsScene, scenes.cartScene, scenes.checkoutScene], { ttl: 1000 })
bot.use(session())
bot.use(stage.middleware())

bot.command('start', enter('language'))
bot.command('categories', enter('categories'))

bot.command('start',ctx=>{
    ctx.scene.enter('language')
})

bot.command('products',ctx=>enter('categories'))

bot.startPolling()

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});