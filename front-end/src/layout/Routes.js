import React from "react";
import { Redirect, Route, Switch } from "react-router-dom"
import { today } from "../utils/date-time"
import Dashboard from "../dashboard/Dashboard"
import SearchReservations from "../search/SearchReservations"
import CreateReservation from "../reservations/CreateReservation"
import EditReservation from "../reservations/EditReservation"
import SeatReservation from "../reservations/SeatReservation"
import CreateTable from "../tables/CreateTable"
import NotFound from "./NotFound"

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route path="/reservations/new">
        <CreateReservation />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatReservation />
      </Route>
      <Route exact={true} path="/tables">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/tables/new">
        <CreateTable />
      </Route>
      <Route path="/search">
        <SearchReservations />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  )
}

export default Routes