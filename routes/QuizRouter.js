const express = require("express");
const bodyParser = require("body-parser");
const Quiz = require('../models/quiz')
const quizRouter = express.Router();
var authenticate = require('../authenticate');

quizRouter.use((bodyParser.json()))


// capital
quizRouter.route('/:quizId/populate')
    .get(function (req, res, next) {
        const quizId = req.params.quizId;

        Quiz.findOne({ _id: quizId })
            .populate({
                path: 'questions',
                match: { text: { $regex: /capital/i } } // Example filter condition
            })
            .exec()
            .then(quiz => {
                if (!quiz) {
                    res.status(404).json({ error: 'Quiz not found' });
                    return;
                }

                res.json(quiz);
            })
            .catch(error => {
                console.error("Error finding quiz:", error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    });

// normal
quizRouter
    .route("/")
    .get((req, res, next) => {
        Quiz.find({})
            .populate('questions')
            .then(
                (Quiz) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    console.log("Get success!!");
                    res.json(Quiz);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

    .post(authenticate.verifyUser, (req, res, next) => {
        Quiz.create(req.body)
            .then(
                (quiz) => {
                    console.log("quiz created ", quiz);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(quiz);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /quiz");
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Quiz.deleteMany({})
            .then(
                (resp) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(resp);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    });

// QUIZ_ID

quizRouter
    .route("/:quizId")
    .get((req, res, next) => {
        Quiz.findById(req.params.quizId)
            .then(
                (quiz) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(quiz);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation not supported on /quiz/ " + req.params.quizId);
    })
    .put((req, res, next) => {
        Quiz.findByIdAndUpdate(
            req.params.quizId,
            {
                $set: req.body,
            },
            { new: true }
        )
            .then(
                (quizId) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(quizId);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Quiz.findByIdAndDelete(req.params.quizId)
            .then(
                (resp) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(resp);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    });
module.exports = quizRouter;
