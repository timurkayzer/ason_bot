const Markup = require('telegraf/markup')
const queries = require('./queries')
const translations = require('./translations')

module.exports = {
    isEmpty:(obj)=>{
        if(Object.keys(obj).length === 0 && obj.constructor === Object) return true
        else return false
    },
    getKeyboardOfTerms:(terms = {})=> {

        let keyboard = []

        keyboard.push('⬅ Back')

        for(let key in terms){
            keyboard.push(terms[key].name)
        }

        return keyboard

    },
    getInitialKeyboard:(lang)=>{
        return [
            [translations.main.categories[lang],translations.main.news[lang]],
            [translations.main.sales[lang],translations.main.shipping[lang]],
            [translations.main.cart[lang],translations.main.orders[lang]],
            [translations.main.contacts[lang]]
        ];
    },
    moreProductsKeyboard:()=>{
        return [
                ['⬅ Back','More ➡']
        ]
    },
    backButton:()=>{
        return [['⬅ Back']]
    },
    simpleProductKeyboard:(product)=>{
        console.log(product)
        let buttonData = {
            p:product.id,
            v:""
        }
        return Markup.inlineKeyboard([
            [
                Markup.urlButton('🌐 See on website',product.permalink),
            ],
            [
                Markup.callbackButton('Add to cart',JSON.stringify(buttonData))
            ]
        ])
    },
    variableProductKeyboard:(product,variations)=>{

        let buttonsList = [
            [
                Markup.urlButton('🌐 See on website',product.permalink),
            ]
        ]

        for(let i in variations){

            let variationString = ""

            let counter = 0

            for(let attr in variations[i].attributes){
                if(counter!==0)
                    variationString+=' , '
                variationString += variations[i].attributes[attr].name + ' : ' + variations[i].attributes[attr].option
                counter++
            }

            console.log(variations[i])

            variationString += ',  Price:' + variations[i].price

            //console.log(typeof JSON.stringify(variations[i]).toString())

            //console.log(variations[i].id)

            let buttonData = {
                v:variations[i].id,
                p:product.id
            }

            console.log(variations[i].id)
            console.log(product.id)

            buttonsList.push([
                Markup.callbackButton(variationString, JSON.stringify(buttonData))
            ])

        }

        return Markup.inlineKeyboard(buttonsList)



    },
    cartKeyboard:async (cart)=>{

        cartKeys = []

        for(i in cart){
            if(cart[i].product["v"]) {
                let variation = await queries.getVariationbyId(cart[i].product["p"],cart[i].product["v"])
                let product = await queries.getProductbyId(cart[i].product["p"])
                let variationString = product.name + " "
                let counter = 0
                product = JSON.parse(product)
                variation = JSON.parse(variation)

                for(let attr in variation.attributes){
                    if(counter!==0)
                        variationString+=' , '
                    variationString += variation.attributes[attr].name + ' : ' + variation.attributes[attr].option
                    counter++
                }

                variationString += ',  Price:' + variation.price
                cartKeys.push(Markup.callbackButton(variationString,cart[i]))

            }
            else{
                if(cart[i].product["p"]){
                    let product = await queries.getProductbyId(cart[i].product["p"])
                    product = JSON.parse(product)
                    let buttonData = cart[i]
                    cartKeys.push(Markup.callbackButton(product.name,JSON.stringify(buttonData)))
                }
            }
        }


    },
    cartInlineKeyboard: (variations,products)=>{

        let keys = []

        for(let i in variations){
            keys.push([Markup.callbackButton("❌ " +variations[i].p.name, JSON.stringify({
                id:variations[i].vId,
                type:'v',
                action:'del'
            }) )])
        }

        for(let i in products){
            if(products.id === undefined){
                keys.push([Markup.callbackButton("❌ " +products[i].name, JSON.stringify({
                    id:products[i].id,
                    type:'p',
                    action:'del'
                }) )])
            }
            else{
                keys.push([Markup.callbackButton("❌ " +products.name, JSON.stringify({
                    id:products.id,
                    type:'p',
                    action:'del'
                }) )])
            }

        }

        if(keys.length) keys.push([Markup.callbackButton("🖊 Checkout", JSON.stringify({
            action:'checkout'
        }) )])

        keys.push([Markup.callbackButton("⬅ Back", JSON.stringify({
            action:'back'
        }) )])

        return keys

    }
}
