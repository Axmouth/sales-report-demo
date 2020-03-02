var express = require('express');
var router = express.Router();
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Sales = require('../models/Sales.js');

server.listen(4000);

// socket io
io.on('connection', (socket) => {
    //
});

// list data
router.get('/', async (req, res) => {
    const sales = await Sales.find().catch(err => next(err));
    return res.json(sales);
});

// item sales report
router.get('/itemsales',  async (req, res, next) => {
    const sales = await Sales.aggregate([
        {
            $group: { 
                _id: { itemId: '$itemId', itemName: '$itemName' }, 
                totalPrice: {
                    $sum: '$totalPrice'
                }
            }
        },
        { $sort: {totalPrice: 1} }
    ]).catch(err => next(err))
    return res.json(sales);
});

// get data by id
router.get('/:id', async (req, res, next) => {
    const sale = await Sales.findById(req.params.id).catch(err => next(err));
    return res.json(sale);
});
  
// post data
router.post('/', async (req, res, next) => {
    const sale = await Sales.create(req.body).catch(err => {
        console.log(err);
        return next(err);
    })
    console.log(sale);
    io.emit('update-data', { data: sale });
    return res.json(sale);
});
  
// put data
router.put('/:id', async (req, res, next) => {
    const sale = await Sales.findByIdAndUpdate(req.params.id, req.body).catch(err => {
        console.log(err);
        return next(err);
    });
    const data = req.body;
    data._id = req.params.id;
    io.emit('update-data', { data: data });
    res.json(sale);
});
  
// delete data by id
router.delete('/:id', async (req, res, next) => {
    const sale = await Sales.findByIdAndRemove(req.params.id, req.body).catch(err => next(err));
    io.emit('update-data', { data: sale });
    return res.json(sale);
});

module.exports = router;