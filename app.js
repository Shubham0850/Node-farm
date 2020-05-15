// Including modules require in this app
const fs = require('fs');
const http = require('http');
const url = require('url');

//cardHtml function
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%product-name%}/g, product.productName);
    output = output.replace(/{%price%}/g, product.price);
    output = output.replace(/{%from%}/g, product.from);
    output = output.replace(/{%image%}/g, product.image);
    output = output.replace(/{%id%}/g, product.id);
    output = output.replace(/{%nutrients%}/g, product.nutrients);
    output = output.replace(/{%quantity%}/g, product.quantity);
    output = output.replace(/{%description%}/g, product.description);
    if (!product.organic) output = output.replace(/{%not-organic%}/g, 'not-organic');
    return output;
} 

// Reading our templet and storing in variables
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/product-card.html`, 'utf-8');
// Reading our json data and storing it in variable
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');

// Parsing json data to convert into javascript object name productData
const productData = JSON.parse(data);

// Creating our server
const server = http.createServer((req, res) => {
    // Getting url path from browser request
    const { query, pathname } = url.parse(req.url, true);
    console.log(url.parse(req.url, true));

    // Home page or overview page
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const cardsHtml = productData.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%product-card%}', cardsHtml)
        res.end(output);
    } 
    // Product page
    else if ( pathname === '/product') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const product = data[query.id];
        console.log(query.id);
        const output = replaceTemplate(tempProduct, product);
        console.log(product);
        res.end(output);
    } 
    // API page
    else if ( pathname === '/api' ) {
        res.writeHead(200, { 'Content-type': 'application/json'});
        res.end(data);
    }
    // Error page
    else {
        res.writeHead(404, {'Content-type': 'text/html'});
        res.end('Page not found');
    }
});

// Starting server at port 8000 or Listening requests on port 8000 
server.listen(8000, () => {
    // Log to the console when our server is ready to work
    console.log("Server is started at port 8000");
});