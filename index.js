const express =require("express")
const app = express()
const mongoose = require("mongoose")
require('dotenv').config()

app.use(express.json())

require('./bot/bot')







async  function dev(){
  try {
    await  mongoose.connect(process.env.MONGO_URL,{
      useNewUrlParser:true
    })
    .then(()=>{
      console.log('Mongodb start');
    })
    .catch((error)=>{
      console.log(error);
    })
    app.listen(process.env.PORT,()=>{
      console.log('Server START');
    })
   
  } catch (error) {
    console.log(error);
  }
}



dev()









// const bot = new TELEGRAM_BOT(process.env.TOKEN,{
//   polling:true
// }) 
// bot.on('message',msg=>{
//   bot.sendMessage(msg.from.id ,'Evro remont ketyapdi')
// })












// bot.on('message',async(msg)=>{
//   const chatId = msg.from.id
//   const text = msg.text
//   if (text ==='/start') {
//       let checkUser = await User.findOne({chatId}).lean()
//       if (!checkUser) {
//         const newUser = new User({
//           name:msg.from.first_name,
//           chatId,
//           createdAt:new Date(),
//           action:'start'
//         })
//         await newUser.save()
//       }
//   }else{
//     bot.sendMessage(chatId,`Salom,${msg.from.first_name.toLocaleUpperCase()}`)
//   }
//   console.log(msg);
// })
// async function dev() {
//   try {
//     mongoose.connect(MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true})
//     .then(()=>console.log('MongoDB connect'))
//     .catch((error)=>console.log(error))

//     app.listen(PORT,()=>{
//       console.log('Server ishga tushdi')
//     })

//   } catch (error) {
//    console.log(error); 
//   }
// }
// dev()