import type { MapRef, MapProps } from 'react-map-gl';

import MapGL from 'react-map-gl';
import { forwardRef } from 'react';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export const Map = forwardRef<MapRef, MapProps>(({ ...other }, ref) => (
  <MapGL
    ref={ref}
    // @ts-ignore
    mapLib={import('mapbox-gl')}
    mapboxAccessToken={CONFIG.mapbox.apiKey}
    {...other}
  />
));
