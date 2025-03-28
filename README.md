# @patternize/travel-map

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
1. Bump version:
```bash
npm version patch
```

2. Push changes with tags:
```bash
git push --follow-tags
```

## License

MIT 