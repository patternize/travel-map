# @patternize/travel-map

[![npm version](https://img.shields.io/npm/v/@patternize/travel-map.svg)](https://www.npmjs.com/package/@patternize/travel-map)
[![npm downloads](https://img.shields.io/npm/dm/@patternize/travel-map.svg)](https://www.npmjs.com/package/@patternize/travel-map)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@patternize/travel-map)](https://bundlephobia.com/package/@patternize/travel-map)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

![](./demo.gif)

An interactive globe map component for React applications, featuring smooth animations, custom markers, and bounce cards.

## Installation

```bash
npm install @patternize/travel-map
# or
yarn add @patternize/travel-map
```

## Usage

```tsx
import { GlobeMap } from '@patternize/travel-map';

function App() {
  const markers = [
    {
      id: 1,
      longitude: -74.006,
      latitude: 40.7128,
      name: 'New York',
      description: 'The Big Apple',
      images: [
        'https://example.com/ny1.jpg',
        'https://example.com/ny2.jpg',
        'https://example.com/ny3.jpg'
      ]
    },
    // ... more markers
  ];

  return (
    <GlobeMap
      width="100%"
      height={500}
      mapboxToken="YOUR_MAPBOX_TOKEN"
      markers={markers}
      enableAnimation={true}
      interactiveMarkers={true}
      showBounceCards={true}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| width | string \| number | '100%' | Width of the map container |
| height | string \| number | 500 | Height of the map container |
| mapboxToken | string | - | Your Mapbox access token |
| initialViewState | object | { longitude: 0, latitude: 0, zoom: 1 } | Initial view state of the map |
| markers | MarkerData[] | [] | Array of markers to display |
| onMarkerClick | (marker: MarkerData) => void | - | Callback when a marker is clicked |
| enableAnimation | boolean | false | Enable auto-rotation animation |
| interactiveMarkers | boolean | true | Enable marker interaction |
| showBounceCards | boolean | true | Show bounce cards on marker click |

## MarkerData Interface

```typescript
interface MarkerData {
  id: string | number;
  longitude: number;
  latitude: number;
  size?: number;
  color?: string;
  name?: string;
  description?: string;
  images?: string[];
}
```

### Publishing

This repository is set up with GitHub Actions workflows for automated publishing:

1. **Tag-based publishing**: When you push a tag with the format `v*.*.*` (e.g., `v0.1.2`), GitHub Actions will automatically build and publish the package to npm.
```bash
npm version patch
git push --follow-tags
```

2. **Manual workflow**: You can also trigger a manual publish from the GitHub Actions tab:
   - Go to the "Actions" tab in your GitHub repository
   - Select "Manual Publish to npm" workflow
   - Click "Run workflow"
   - Choose the version increment type (patch, minor, major) or enter a custom version
   - The workflow will update the version, build, and publish to npm

> Note: Both workflows require an NPM_TOKEN secret to be set in your GitHub repository settings.

## License

MIT 