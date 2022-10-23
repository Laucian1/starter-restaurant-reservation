const tablesService = require("./tables.service")
const reservationsService = require("../reservations/reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const { table } = require("../db/connection")

// VALIDATION //

function bodyDataHas(propertyName) {
    return function (req, res, next) {
        const { data = {} } = req.body 
        if (data[propertyName]) {
            return next()
        }
        next({
            status: 400,
            message: `Must include a ${propertyName}`,
        })
    }
}

function validTableNameProp(req, res, next) {
    const { table_name } = req.body.data
    if (table_name.length > 1) {
        return next()
    } else {
        return next({
            status: 400,
            message: `Invalid field: 'table_name' must be at least two characters long.`,
        })
    }
}

function validCapacityProp(req, res, next) {
    const { capacity } = req.body.data
    if (typeof capacity === "number" && capacity > 0) {
        return next()
    } else {
        return next({
            status: 400,
            message: `Invalid field: 'capacity' must be at least 1.`,
        })
    }
}

async function tableExists(req, res, next) {
    const tableId = req.params.table_id
    const existingTable = await tablesService.read(tableId)
    if (existingTable) {
        res.locals.table = existingTable
        return next()
    } else {
        return next({
            status: 404,
            message: `Table ${tableId} does not exist.`,
        })
    }
}

async function reservationExists(req, res, next) {
    const reservationId = req.body.data.reservation_id
    const existingReservation = await reservationsService.read(reservationId)
    if (existingReservation) {
        res.locals.reservation = existingReservation
        return next()
    } else {
        return next({
            status: 404,
            message: `Reservation ${reservationId} does not exist.`,
        })
    }
}

function tableHasCapacity(req, res, next) {
    const table = res.locals.table
    const reservation = res.locals.reservation
    if (table.capacity >= reservation.people) {
        return next()
    } else {
        return next({
            status:400,
            message: `This table does not have the capacity for this reservation.`,
        })
    }
}

function tableAvailable(req, res, next) {
    const tableStatus = res.locals.table.status
    if (tableStatus === "Free") {
        return next()
    } else {
        return next({
            status: 400,
            message: `This table is occupied.`,
        })
    }
}

// REQUEST HANDLERS //

async function create(req, res) {
    const newTable = req.body.data
    const responseData = await tablesService.create(newTable)
    req.status(201).json({ data: responseData })
}

async function read(req, res) {
    const tableId = req.paraams.table_id
    const responseData = await tablesService.read(rableId)
    res.status(200).json({ data: responseData })
}

async function updateStatusToOccupied(req, res, next) {
    const tableId = res.locals.table.table_id
    const reservationId = res.locals.reservation.reservation_id
    const responseData = await tablesService.updateStatusToOccupied(
        tableId,
        reservationId
    )
    res.status(200).json({ data: responseData })
}

async function list(req, res) {
    const responseData = await tablesService.list()
    res.status(200).json({ data: responseData })
}

// EXPORTS //

module.exports = {
    create: [
        bodyDataHas("table_name"),
        bodyDataHas("capacity"),
        validTableNameProp,
        validCapacityProp,
        asyncErrorBoundary(create),
    ],
    read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
    updateStatusToOccupied: [
        bodyDataHas("reservation_id"),
        asyncErrorBoundary(tableExists),
        asyncErrorBoundary(reservationExists),
        tableHasCapacity,
        tableAvailable,
        asyncErrorBoundary(updateStatusToOccupied),
    ],
    list: [asyncErrorBoundary(list)],
}