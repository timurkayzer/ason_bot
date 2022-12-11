const Redis = require('ioredis')
let redis = new Redis(6379)

/*
*
TelegrafContext {
  tg:
   Telegram {
     token: '486055194:AAFDXeJaLlWS4jLviVy0ByBdiEG1wNlEzwI',
     options:
      { apiRoot: 'https://api.telegram.org',
        webhookReply: true,
        agent: [Agent] },
     response: undefined },
  update:
   { update_id: 862140207,
     callback_query:
      { id: '324024997008178761',
        from: {   id: 75442948,
                  is_bot: false,
                  first_name: 'Timur',
                  last_name: 'Kaiser',
                  username: 'timurkayzer',
                  language_code: 'ru' },
        message: [Object],
        chat_instance: '248730962747264738',
        data: 'UZ' } },
  options: { retryAfter: 1, handlerTimeout: 3000 },
  updateType: 'callback_query',
  updateSubTypes: [],
  contextState: {},
  scene:
   SceneContext {
     ctx: [Circular],
     scenes:
      Map {
        'language' => [BaseScene],
        'main' => [BaseScene],
        'categories' => [BaseScene],
        'products' => [BaseScene] },
     options: { sessionName: 'session', ttl: 1000 } } }
* */

function getCart (userId){
    let cart = redis.get('cart_'+userId)
    return cart
}

module.exports = {
    addToCart : async (userId, product) => {
        let cart = await getCart(userId)
        cart = JSON.parse(cart)
        if(cart){
            let isInCart = false

            for(let i in cart){
                if(product === cart[i].product){
                    cart[i].qty++
                    isInCart = true
                }
            }
            if(!isInCart)
            cart[Object.keys(cart).length] = {qty:1,product:product}
        }
        else{
            cart = {}
            cart[0] = {
                qty : 1,
                product : product
            }
        }


        cart = JSON.stringify(cart)
        redis.set('cart_'+userId,cart)
    },
    getCart: getCart,
    deleteFromCart: async (userId, product)=>{

        let cart = await getCart(userId)
        cart = JSON.parse(cart)

        let prodType = product.type


        for(let i in cart){
            console.log(cart[i].product[prodType])
            if(cart[i].product[prodType]===product.id){
                delete cart[i]
            }
        }
        console.log(cart)
        if(Object.keys(cart).length === 0 && cart.constructor === Object)redis.del('cart_'+userId)
        else redis.set('cart_'+userId,JSON.stringify(cart))


    },
    setLanguage:(userId,lang)=>{
        redis.set("lang_"+userId,lang)
    },
    getLanguage:(userId)=>{
        return redis.set("lang_"+userId)
    }
}
