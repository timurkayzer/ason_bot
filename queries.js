const request = require('request-promise')

const website = "https://ason.uz"
//const ck_key = "ck_de9f7a102f4e4881342e9d5c79102828ebbb109f"
const ck_key = "ck_72bf0ae8d613921a2bf40f6852f1ea1c7771ae7f"
//const cs_key = "cs_28ae1862c0e0a37cbf917e5279c75052f0cd0bd6"
const cs_key = "cs_f3b55dd869f551a812ceed9251595c3d648f5873"

/*
    woocommerce-categories/top-lv-cat/
	woocommerce-categories/top-lv-brands/<id>
	woocommerce-categories/brands-cats/<brand_id>/<cat_id>
	woocommerce-categories/brands-products/<brand>/<cat>
    woocommerce-categories/product-brand/<id>
*/

function getCategoryChildren (categories,catId){
    if(categories!==undefined){
        for(let i in categories){
            if(categories[i]['term_id'] === catId){
                return categories[i].children
            }
            getCategoryChildren(categories[i].children,catId)
        }
    }
    return {}
}

async function getCategoriesHierarchy(){
    try{
        let categories = await request.get(website+'/wp-json/woocommerce-categories/product-categories/')
        module.exports.categories = JSON.parse(categories)
        return categories
    }
    catch(e){
        console.error(e)
    }
}

function getProductVariations(id){
    try{
        let variations = request.get(website+'/wp-json/wc/v2/products/'+id+'/variations?+&consumer_key='+ ck_key
            +'&consumer_secret='+cs_key)
        return variations
    }
    catch(e){
        console.error(e)
    }
}

getCategoriesHierarchy()

module.exports = {
    getCategoryChildren:getCategoryChildren,
    getCategoryProducts:(id = "",paged = 1)=>{
        try{
            reqUrl = website+'/wp-json/wc/v2/products?per_page=4&category='+ id +'&page='+ paged +'&consumer_key='+
                ck_key +'&consumer_secret='+cs_key
            let products = request.get(reqUrl)
            return products
        }
        catch(e){
            console.error(e)
        }
    },
    getCategoriesHierarchy:getCategoriesHierarchy,
    getProductVariations:getProductVariations,
    getProductbyId:(id)=>{
        try{
            reqUrl = website+'/wp-json/wc/v2/products/'+ id +'/?consumer_key='+ ck_key +'&consumer_secret='+cs_key
            let product = request.get(reqUrl)
            //console.log(reqUrl)
            return product
        }
        catch(e){
            console.error(e)
        }
    },
    getVariationbyId:(prodId,varId)=>{
        try{
            reqUrl = website+'/wp-json/wc/v2/products/'+ prodId +'/variations/' + varId + '?consumer_key='+ ck_key +'&consumer_secret='+cs_key
            let products = request.get(reqUrl)
            return products
        }
        catch(e){
            console.error(e)
        }
    },
    getProductsById(ids){
        try{
            reqUrl = website+'/wp-json/wc/v2/products/?include[]='+ids.join('&include[]=')+'&consumer_key='+ ck_key +'&consumer_secret='+cs_key
            //console.log(reqUrl)
            let products = request.get(reqUrl)
            return products
        }
        catch(e){
            console.log(e)
        }
    },
    getVariationByProduct(v,p){
        try{
            reqUrl = website+'/wp-json/wc/v2/products/'+ p +'/variations/'+ v +'/?consumer_key='+ ck_key +'&consumer_secret='+cs_key
            let variation = request.get(reqUrl)
            return variation
        }
        catch(e){
            console.log(e)
        }
    },

}