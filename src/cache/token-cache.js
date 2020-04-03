//Singleton class to store in-memory token cache

const HashMap = require('hashmap');

class TokenMemoryCache {

    constructor(){
        this.cache = new HashMap();
    }

    foundInCache(key){
        if(this.cache.has(key)){
            return true;
        }
        return false;
    }

    addToCache(key, value){
        this.cache.set(key, value);
    }

    getFromCache(key){
        return this.cache.get(key);
    }

    printCache(){
        console.log("TokenMemoryCache.cache: ------");
        this.cache.forEach(function(value, key) {
            console.log(key + " : " + JSON.stringify(value));
        });
        console.log("------------------------------");
    }
}

class TokenMemoryCacheSingleton {

    constructor(){
        if(!TokenMemoryCacheSingleton.instance){
            TokenMemoryCacheSingleton.instance = new TokenMemoryCache();
        }
    }

    getInstance() {
        return TokenMemoryCacheSingleton.instance;
    }

}

module.exports = TokenMemoryCacheSingleton;