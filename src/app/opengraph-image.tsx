import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'SoulmatePaw - AI Pet Finder';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          background: 'linear-gradient(135deg, #8DA399 0%, #6B8E82 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          style={{ marginBottom: 20 }}
        >
          <path
            fill="white"
            d="M30 15c0-8.3 6.7-15 15-15s15 6.7 15 15-6.7 15-15 15-15-6.7-15-15zm-25 25c0-8.3 6.7-15 15-15s15 6.7 15 15-6.7 15-15 15-15-6.7-15-15zm75 0c0-8.3 6.7-15 15-15s15 6.7 15 15-6.7 15-15 15-15-6.7-15-15zM50 40c-16.6 0-30 13.4-30 30 0 8.3 6.7 15 15 15 5.5 0 10.3-3.2 12.8-7.8 2.5 4.6 7.3 7.8 12.8 7.8 8.3 0 15-6.7 15-15 0-16.6-13.4-30-30-30z"
          />
        </svg>
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 20,
            letterSpacing: '-2px',
          }}
        >
          SoulmatePaw
        </div>
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            maxWidth: '80%',
          }}
        >
          Find your perfect pet match with AI & Psychology.
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
