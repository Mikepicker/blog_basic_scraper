const scrapeIt = require('scrape-it')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db/database.sqlite')

const wait = (time) => new Promise(resolve => setTimeout(resolve, time))

// scrape Amazon by asin (product id)
const scrapeAmazon = (asin) => {
  const url = `https://amazon.com/dp/${asin}`
  console.log('Scraping URL', url)
  return scrapeIt(url, {
    price: {
      selector: '#price_inside_buybox',
      convert: p => Math.round(parseInt(p.split('$')[1])) * 100
    }
  })
}

// update pedal price
const updatePrice = (asin, price) => {
  console.log('Updating item:', asin, price)
  db.run(`
      UPDATE items SET price = '${price}'
      WHERE asin = '${asin}'
    `, (err) => {
    if (err) {
      console.log(err)
    }
  })
}

const scrape = async () => {
  db.all('SELECT * FROM items', [], async (err, items) => {
    for (const item of items) {
      const scraped = await scrapeAmazon(item.asin)
      if (scraped.response.statusCode === 200 && scraped.data.price) {
        updatePrice(item.asin, scraped.data.price)
      } else {
        console.log('Out of stock')
      }
      await wait(2000)
    }
  })
}

scrape()
