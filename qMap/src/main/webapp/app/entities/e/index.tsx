import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import E from './e';
import EDetail from './e-detail';
import EUpdate from './e-update';
import EDeleteDialog from './e-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={EUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={EUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={EDetail} />
      <ErrorBoundaryRoute path={match.url} component={E} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={EDeleteDialog} />
  </>
);

export default Routes;
