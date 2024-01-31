const redis = require('redis')


class Redis {

    constructor() {
        this.client = redis.createClient(process.env.REDIS_URL)
        this.client.closing = true
        this.client.on('error', (error) => {
          console.error(`Error connecting to Redis: ${error.message}`);
        });
        // this.client.closing = false
    }

    async get(key) {
        return new Promise((resolve, reject) => {
          this.client.get(key, (error, result) => {
            if (error) {
              reject(new Error(`Error getting value from Redis: ${error.message}`));
            } else {
              resolve(result ? JSON.parse(result) : null);
            }
          });
        });
      }

      async set(key, value, expirationTime = 100) {
        return new Promise((resolve, reject) => {
          this.client.set(key, JSON.stringify(value), 'EX', expirationTime, (error, result) => {
            if (error) {
              reject(new Error(`Error setting value in Redis: ${error.message}`));
            } else {
              resolve(result);
            }
          });
        });
      }

}

module.exports = new Redis()

// const redis  = require('redis')
// const client = redis.createClient({
//     host: '127.0.0.1',
//     port: 6379
// })

//    const  getCached  = async(key)=>{
//     console.log("here1")
//         return await client.get(key)
//     }
//     const setData  = async(key , value , expirationTime=3600)=>{
//         console.log("here2")
//         return await client.set(key , value , 'EX' , expirationTime)
//     }
// module.exports={
//     getCached,
//     setData,
    
// }
// module.exports = {
    
//     getCached : (key)=>{
//         return new Promise((resolve, reject)=>{
//             client.get(key, (err, data)=>{
//                 if(err){
//                     console.log(`Error getting data from Redis for key ${key}: ${err}`)
//                     reject(err)
//                 }else{
//                     resolve(data) 
//                 }
//             })
//         })
//     },
//     setData  : (key , value , expirationTime=3600)=>{
//         return new Promise((resolve, reject)=>{
//             client.set(key , value , 'EX' , expirationTime , (err, data)=>{
//                 if(err){
//                     console.log(`Error setting data in Redis for key ${key}: ${err}`)
//                     reject(err)
//                 }else{
//                     resolve(data)
//                 }
//             })
//         })
//     },
//      client
// }

// const util = require('util')
// const redis = require('redis')
// const redisURl = 'redis://127.0.0.1:6379'
// const client = redis.createClient(redisURl).on('error', (err) => console.log('Redis Client Error', err))

// client.get= util.promisify(client.get)
// client.set= util.promisify(client.set)

// app.post("/" , async(req,res)=>{
//     const {key , value } = req.body 
//     const response = await client.set(key , value)
//     res.json(response)
// })
// app.get("/" , async(req,res)=>{
//     const {key} = req.body 
//     const response = await client.get(key)
//     res.json(response)
// })