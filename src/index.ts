import express from 'express';

const app = express()
const port = 3000

const HTTP_STATUSE = {
    OK2_00: 200,
    CREATED_201 : 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
}

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

const db = {
    courses : [
        { id: 1, title: 'front-end'},
        { id: 2, title: 'beck-end'},
        { id: 3, title: 'automat'},
        { id: 4, title: 'devops'}
    ]
}

app.get('/courses', (req, res) => {
    let foundCourses = db.courses;
    if(req.query.title) {
        foundCourses = foundCourses
            .filter( c => c.title.indexOf(req.query.title as string) > -1)
    }


    res.json(foundCourses)
})

app.get('/courses/:id', (req, res) => {

    const foundCourse = db.courses.find(c => c.id === +req.params.id)
    if(!foundCourse) {
        res.statusCode(HTTP_STATUSE.NOT_FOUND_404);
        return;
    }
    res.json(foundCourse)
})

app.post('/courses', (req, res) => {

    if(!req.body.title) {
        res.sendStatus(HTTP_STATUSE.BAD_REQUEST_400);
        return;
    }

    const createdCourse = {
        id: +(new  Date()),
        title: req.body.title
    }
    db.courses.push(createdCourse)
    res.json(createdCourse)
})

app.delete('/courses/:id', (req, res) => {

    db.courses = db.courses.filter(c => c.id !== +req.params.id)


    res.sendStatus(HTTP_STATUSE.NO_CONTENT_204)
})

app.put('/courses/:id', (req, res) => {
    if(!req.body.title) {
        res.sendStatus(HTTP_STATUSE.BAD_REQUEST_400);
        return;
    }


    const foundCourse = db.courses.find(c => c.id === +req.params.id)
    if(!foundCourse) {
        res.sendStatus(HTTP_STATUSE.NOT_FOUND_404);
        return;
    }
    foundCourse.title = req.body.title;
    res.sendStatus(HTTP_STATUSE.NO_CONTENT_204)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



fetch('http://localhost:3000/courses/2', {method: 'GET'})
    .then(res => res.json())
    .then(json => console.log(json))