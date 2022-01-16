const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const authRoute = require('./auth/authRoutes')
const projectRoute = require('./project/projectRoutes');
const milestoneRoute = require('./milestone/milestoneRoutes');

app.use(bodyParser.json());


app.use('/auth', authRoute);
app.use('/project', projectRoute);
app.use('/milestone', milestoneRoute);

app.use((error, req, res, next) => {
    
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;

    console.log('inside appjs error middleware');
    console.log(status, message);

    res.status(status).json({message: message, data: data });

})

mongoose
.connect('mongodb+srv://tarikul13:mongotarikul13@cluster0.llyo3.mongodb.net/MchichocrmDB?retryWrites=true&w=majority')
.then(result => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});

// mongoose
// .connect('mongodb://localhost:27017/mchichocrmDB')
// .then(result => {
//     app.listen(3000);
// })
// .catch(err => {
//     console.log(err);
// });