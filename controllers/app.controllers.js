const { selectTopics } = require("../models/app.models")
const endpoints = require("../endpoints.json")

exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics})
    })
}

exports.getApiEndpoints = (req, res, next) => {
        res.status(200).send(endpoints)
}