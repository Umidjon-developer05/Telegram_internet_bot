const Product = require('../../model/product')
const User = require('../../model/user')
const { bot } = require('../bot')

const add_product = async (chatId, category) => {
  const newProduct = new Product({
    category,
    status: 0
  })
  await newProduct.save()
  let user = await User.findOne({ chatId }).lean()
  await User.findByIdAndUpdate(user._id, {
    ...user,
    action: 'new_product_title'
  }, { new: true })
  bot.sendMessage(chatId, `Yangi mahsulot nomini kiriting`)

}


const steps = {
  'title': {
    action: 'new_product_price',
    text: `Mahsulot narhini kiriting`
  },
  'price': {
    action: `new_product_img`,
    text: 'Mahsulot rasmini kiriting'
  },
  'img': {
    action: `new_product_text`,
    text: `Mahsulot qisqa malumot kiriting kiriting`
  },
}
const add_product_next = async (chatId, value, slug) => {
  let user = await User.findOne({ chatId }).lean()
  let product = await Product.findOne({ status: 0 }).lean()

  if (product) {
    if (['title', 'text', 'price', 'img'].includes(slug)) {
      product[slug] = value
      if (slug === 'text') {
        product.status = 1
        await User.findByIdAndUpdate(user._id, {
          ...user,
          action: 'catalog'
        })
        bot.sendMessage(chatId, 'Yangi mahsulot kiritib bo`lindi!')
      } else {
        await User.findByIdAndUpdate(user._id, {
          ...user,
          action: steps[slug].action,
        })
        bot.sendMessage(chatId, steps[slug].text)
      }
      await Product.findByIdAndUpdate(product._id, product, { new: true })
    }
  } else {
    bot.sendMessage(chatId, '')
  }
}


const clear_draft_product = async () => {
  let products = await Product.find({ status: 0 }).lean()
  if (products) {
    await Promise.all(products.map(async product => {
      await Product.findByIdAndDelete(product._id)
    }))
  }
}


const show_product = async (chatId, id, count = 1, message_id = null) => {
  let product = await Product.findById(id).populate(['category']).lean()
  let user = await User.findOne({ chatId }).lean()




  const inline_keyboard = [
    [
      {
        text: '➖',
        callback_data: `less_count-${product._id}-${count}`
      },
      {
        text: count,
        callback_data: count
      },
      {
        text: '➕',
        callback_data: `more_count-${product._id}-${count}`
      },
    ],
    user.admin ?
      [
        {
          text: '✏️Tahrirlash',
          callback_data: `edit_product-${product.id}`
        },
        {
          text: '🗑o`chirish',
          callback_data: `del_product-${product.id}`
        },
      ]
      : [],
    [
      {
        text: '🛒 Buyurtma berish',
        callback_data: `order-${product._id}-${count}`
      }
    ]
  ]


  if (message_id > 0) {
    bot.editMessageReplyMarkup({ inline_keyboard }, { chat_id: chatId, message_id })
  } else {
    bot.sendPhoto(chatId, product.img, {
      caption: `<b>${product.title}</b>\n📦Turkum:${product.category.title}\n💸Narhi:${product.price} so'm\n🔥Qisqa malumot\n${product.text}`,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard
      }
    })
  }

}
const delete_product = async (chatId, id, sure) => {
  let user = await User.findOne({ chatId }).lean()
  if (user.admin) {
    if (sure) {
      await Product.findByIdAndDelete(id)
      bot.sendMessage(chatId, 'Mahsulot o`chirirldi!')
    } else {

      bot.sendMessage(chatId, `Mahsulotni o'chirmoqchisiz. Qaroringiz qa'tiymi`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '❌ Yo`q',
                callback_data: 'catalog'

              },
              {
                text: '✅ Ha',
                callback_data: `rem_product-${id}`
              }
            ]
          ]
        }
      })
    }
  } else {
    bot.sendMessage(chatId, `Sizga mahsulot o'chirish mumkin emas`)
  }
}
module.exports = {
  add_product,
  add_product_next,
  clear_draft_product,
  show_product,
  delete_product
}