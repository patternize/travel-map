// @ts-ignore - Type declarations for react-map-gl may vary between versions
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCallback, useEffect, useRef, useState } from 'react';
// Import from specific subpath as required by react-map-gl v8+
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl/mapbox';
import BounceCards from '../BounceCards/BounceCards';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  globeMapContainer: {
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  globeMap: {
    width: '100%',
    height: '100%'
  },
  globeMapMarker: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    border: '2px solid rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
    boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.2)'
    },
    '&.selected': {
      transform: 'scale(1.5)'
    }
  },
  globeMapPopup: {
    maxWidth: 300
  },
  globeMapPopupTitle: {
    margin: '0 0 5px 0',
    fontSize: 16
  },
  globeMapPopupDescription: {
    margin: 0
  },
  globeMapPopupCoordinates: {
    marginTop: 5,
    fontSize: 12,
    color: '#666'
  },
  globeMapControls: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    background: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 4,
    color: 'white',
    fontSize: 12
  },
  globeMapBounceCardsContainer: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
    pointerEvents: 'none'
  },
  globeMapBounceCards: {
    pointerEvents: 'auto',
    '& .card-0, & .card-1, & .card-2, & .card-3, & .card-4': {
      border: '5px solid rgba(255, 255, 255, 0.9)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)'
    }
  },
  // Hide Mapbox logo and attribution
  '@global': {
    '.mapboxgl-ctrl-logo, .mapboxgl-ctrl-attrib': {
      display: 'none !important'
    },
    '.mapboxgl-ctrl-attrib-inner': {
      display: 'none !important'
    }
  }
});

// Define the prop types for the GlobeMap component
interface MarkerData {
  id: string | number;
  longitude: number;
  latitude: number;
  size?: number;
  color?: string;
  name?: string;
  description?: string;
  images?: string[]; // Added images property for bounce cards
}

export interface GlobeMapProps {
  width?: string | number;
  height?: string | number;
  mapboxToken?: string;
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
    bearing?: number;
    pitch?: number;
  };
  markers?: MarkerData[];
  onMarkerClick?: (marker: MarkerData) => void;
  enableAnimation?: boolean;
  interactiveMarkers?: boolean;
  showBounceCards?: boolean; // New prop to control bounce cards feature
}

// Add this function before the GlobeMap component
const calculateColorFromCoordinates = (longitude: number, latitude: number): string => {
  // Normalize coordinates to 0-360 range for hue
  const normalizedLongitude = ((longitude + 180) % 360);
  const normalizedLatitude = ((latitude + 90) % 180);
  
  // Use longitude for hue (0-360)
  const hue = normalizedLongitude;
  
  // Use latitude for saturation (30-70%)
  const saturation = 30 + (normalizedLatitude / 180) * 40;
  
  // Use a fixed lightness for consistency
  const lightness = 55;
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export function GlobeMap({
  width = '100%',
  height = 500,
  mapboxToken = 'YOUR_MAPBOX_TOKEN', // Replace with your actual token when using
  initialViewState = {
    longitude: 0,
    latitude: 0,
    zoom: 1
  },
  markers = [],
  onMarkerClick,
  enableAnimation = false,
  interactiveMarkers = true,
  showBounceCards = true // Default to true
}: GlobeMapProps) {
  const [viewState, setViewState] = useState(initialViewState);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [showCards, setShowCards] = useState(false);
  const mapRef = useRef(null);
  const classes = useStyles();
  console.log(showCards);

  // Default images to use if marker doesn't provide any
  const defaultImages = [
    'https://picsum.photos/400/400?grayscale',
    'https://picsum.photos/500/500?grayscale',
    'https://picsum.photos/600/600?grayscale',
    'https://picsum.photos/700/700?grayscale',
    'https://picsum.photos/300/300?grayscale'
  ];

  // Default transform styles for bounce cards
  const defaultTransformStyles = [
    'rotate(5deg) translate(-150px)',
    'rotate(0deg) translate(-70px)',
    'rotate(-5deg)',
    'rotate(5deg) translate(70px)',
    'rotate(-5deg) translate(150px)'
  ];

  // Handle marker click
  const handleMarkerClick = useCallback(
    (marker: MarkerData) => {
      setSelectedMarker(marker);
      if (showBounceCards) {
        setShowCards(true);
      }
      if (onMarkerClick) {
        onMarkerClick(marker);
      }
    },
    [onMarkerClick, showBounceCards]
  );

  // Close popup and cards when clicking on the map
  const handleMapClick = useCallback((event) => {
    // Check if the click is directly on the map (not on a marker)
    if (event.originalEvent && event.originalEvent.target.classList.contains('mapboxgl-canvas')) {
      setSelectedMarker(null);
      setShowCards(false);
    }
  }, []);

  // Reset cards when selected marker changes
  useEffect(() => {
    if (!selectedMarker) {
      // setShowCards(false);
    }
  }, [selectedMarker]);

  // Add auto-rotation effect if enabled
  useEffect(() => {
    if (!enableAnimation) return;

    const rotationInterval = setInterval(() => {
      setViewState((prev) => ({
        ...prev,
        longitude: (prev.longitude + 0.1) % 360
      }));
    }, 50);

    return () => clearInterval(rotationInterval);
  }, [enableAnimation]);

  return (
    <div style={{ width, height, position: 'relative' }}>
      {/* @ts-ignore - Using @ts-ignore to bypass type issues with react-map-gl */}
      <Map
        ref={mapRef}
        {...viewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v9"
        mapboxAccessToken={mapboxToken}
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={handleMapClick}
        projection="globe"
        attributionControl={false}
        fog={{
          color: 'rgb(182, 37, 155)', 
          'high-color': 'rgb(137, 150, 180)',
          'horizon-blend': 0.1,
          'space-color': 'rgb(168, 168, 171)',
          'star-intensity': 0.7
        }}
      >
        {/* Navigation control */}
        <NavigationControl />

        {/* Markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            longitude={marker.longitude}
            latitude={marker.latitude}
          >
            <div
              className={`${classes.globeMapMarker} ${selectedMarker?.id === marker.id ? 'selected' : ''}`}
              style={{
                width: marker.size ? `${marker.size}px` : undefined,
                height: marker.size ? `${marker.size}px` : undefined,
                backgroundColor: marker.color || calculateColorFromCoordinates(marker.longitude, marker.latitude)
              }}
              onClick={
                interactiveMarkers ? () => handleMarkerClick(marker) : undefined
              }
            />
          </Marker>
        ))}

        {/* Popup for selected marker */}
        {selectedMarker && interactiveMarkers && (
          <Popup
            longitude={selectedMarker.longitude}
            latitude={selectedMarker.latitude}
            onClose={() => setSelectedMarker(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div className={classes.globeMapPopup}>
              {selectedMarker.name && (
                <h3 className={classes.globeMapPopupTitle}>{selectedMarker.name}</h3>
              )}
              {selectedMarker.description && (
                <p className={classes.globeMapPopupDescription}>
                  {selectedMarker.description}
                </p>
              )}
              <div className={classes.globeMapPopupCoordinates}>
                {selectedMarker.latitude.toFixed(4)},{' '}
                {selectedMarker.longitude.toFixed(4)}
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Bounce Cards */}
      {showBounceCards && showCards && selectedMarker && (
        <div className={classes.globeMapBounceCardsContainer}>
          <BounceCards
            className={classes.globeMapBounceCards}
            images={selectedMarker.images || defaultImages}
            containerWidth={500}
            containerHeight={250}
            animationDelay={0.2}
            animationStagger={0.08}
            transformStyles={defaultTransformStyles}
            enableHover={true}
          />
        </div>
      )}

      {/* Controls overlay */}
      {/* <div className="globe-map-controls">
        <div>Longitude: {viewState.longitude.toFixed(2)}°</div>
        <div>Latitude: {viewState.latitude.toFixed(2)}°</div>
        <div>Zoom: {viewState.zoom.toFixed(1)}x</div>
      </div> */}
    </div>
  );
}

export default GlobeMap;
