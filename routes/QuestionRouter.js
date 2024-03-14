const express = require("express");
const bodyParser = require("body-parser");
const Question = require('../models/question')
const questionRouter = express.Router();
var authenticate = require('../authenticate');

questionRouter.use((bodyParser.json()))

questionRouter
    .route("/")
    .get((req, res, next) => {
        Question.find({})
            .then(
                (Question) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    console.log("Get success!!");
                    res.json(Question);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

    .post(authenticate.verifyUser, (req, res, next) => {
        Question.create(req.body)
            .then(
                (question) => {
                    console.log("question created ", question);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(question);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /question");
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Question.deleteMany({})
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

// QUESTION_ID

questionRouter
    .route("/:questionId")
    .get((req, res, next) => {
        Question.findById(req.params.questionId)
            .then(
                (Question) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(Question);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation not supported on /Question/ " + req.params.questionId);
    })
    .put((req, res, next) => {
        Question.findByIdAndUpdate(
            req.params.questionId,
            {
                $set: req.body,
            },
            { new: true }
        )
            .then(
                (QuestionId) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(QuestionId);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Question.findByIdAndDelete(req.params.questionId)
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

module.exports = questionRouter;
