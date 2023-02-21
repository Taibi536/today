//database connection 
const mongoose=require('mongoose')
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/mb',()=>{
    console.log('connect');
})
//express
const express = require('express');
const app = express();

//path for static files
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))



//bodyparser for fetching body
const bodyparser=require('body-parser')
app.use(bodyparser.urlencoded({extended:false}))

//method override for put and delete
const methodOverride=require('method-override')
app.use(methodOverride('_method'))



//database user(login)
const User=require('./models/User')
const Customer=require('./models/customer')
//view engine
app.set('view engine', 'ejs');


// <Routers>
//login

app.get('/', (req, res) => {
    res.render('login' ,{massage:" "});
});
app.post('/',async(req,res)=>{
    try {
      const check =await User.findOne({name:req.body.name})
      if (check.password===req.body.password) {
          res.render('home')
      }
      else{
        res.render('login' ,{massage:"your password is wronge"})
      }
    } catch (error) {
        res.render('login' ,{massage:"you are a new user sign in first"})
    }
  
   })



//sign
app.get('/sign', (req, res) => {
    res.render('sign');
});
app.post('/add',(req,res)=>{
    let name=req.body.name
    let password=req.body.password
    const Data=new User({
        name:name,
        password:password
    })
    Data.save().then(()=>{
        res.redirect('/')
    })
})



 //home
 app.get('/home', (req, res) => {
    res.render('home');
});

 let value=1// slip value
 
 //booking
app.get('/booking', (req, res) => {
    res.render('booking',{value:value});
});
 
//post method of booking
app.post('/s', (req, res) => {
    value++; 
 

console.log(formattedDate);
    
     const Data=new  Customer({
        slip:req.body.slip,
        name:req.body.name,
        number:req.body.number,
        address:req.body.address,
        sitting:req.body.sitting,
        fuction:req.body.fuction,
        area:req.body.area,
        t:req.body.t,
        t_rent:req.body.t_rent,
        a_rent:req.body.a_rent,
        r_rent:req.body.r_rent,
        date:req.body.date       
     })
     Data.save().then(()=>{
        res.redirect('/res-booking')
     }).catch(err=>{console.log(err)})

});
 
// resbooking

app.get('/res-booking', (req, res) => {
    Customer.find().then(data=>{
        res.render('res-booking',{data:data})
    }).catch(err=>{console.log(err)})
});
// search 
app.post('/res-booking', (req, res) => {
    const searchTerm = req.body.searchTerm;
    Customer.find({
        $or: [
            { name: { $regex:'.*'+ searchTerm+'.*' , $options: "i" } },
           
            { address: { $regex:'.*'+ searchTerm+'.*' , $options: "i" } },
           
        ]
    })
        .then(data => {
            res.render('res-booking', { data: data });
        })
        .catch(err => {
            console.log(err);
        });
});


app.get('/home/:id',(req,res)=>{
   Customer.findOne({
    _id:req.params.id
   }).then(data=>{
    res.render('viewslip',{data:data})
   }).catch(err=>console.log(err))
})

// get id
app.get('/data/edit/:id',(req,res)=>{
        
       Customer.findOne({
    _id:req.params.id
   }).then(data=>{
    res.render('edit',{data:data})
   }).catch(err=>console.log(err))
})



//viewslip

app.get('/viewslip',(req,res)=>{
    res.render('viewslip')
})

//edit

app.put('/data/edit/:id',(req,res)=>{
        Customer.findOne({
            _id:req.params.id
        }).then(data=>{
            data.slip=req.body.slip,
            data.name=req.body.name,
            data.number=req.body.number,
            data.address=req.body.address,
            data.sitting=req.body.sitting,
            data.fuction=req.body.fuction,
            data.area=req.body.area,
            data.t=req.body.t,
            data.t_rent=req.body.t_rent,
            data.a_rent=req.body.a_rent,
            data.r_rent=req.body.r_rent,
           data.date=req.body.date    
           data.save().then(()=>{
            res.redirect('/res-booking')
           })  
        }).catch(err=>{console.log(err)})
})


// del on resbooking
app.delete('/data/delete/:id',(req,res)=>{
     Customer.deleteOne({
        _id:req.params.id
     }).then(()=>{
        res.redirect('/res-booking')
     }).catch(err=>{console.log(err)})
})

app.get('/search', (req, res) => {
    res.render('search');
  });
  
  app.post('/search', async (req, res) => {
    const name = req.body.name;
  
    try {
      const customers = await Customer.find({ name: name });
  
      if (customers.length > 0) {
        res.render('results', { customers: customers });
      } else {
        res.render('search', { message: 'No customers found.' });
      }
    } catch (err) {
      console.error(err);
      res.render('search', { message: 'An error occurred while searching.' });
    }
  });


// server

const server = app.listen(4000, () => {
    console.log(`The application started on port ${server.address().port}`);
});
