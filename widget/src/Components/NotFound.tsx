import React from 'react';
import errors from '../static/img/errors.json';

export function NotFound (): React.ReactElement {
  return <div className={'NotFound'} style={{
    backgroundImage: `url("data:image/svg+xml;base64,${errors.notFound}")`
  }}/>
}
