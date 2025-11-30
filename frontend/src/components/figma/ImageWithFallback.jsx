import React, { useState } from 'react';

export function ImageWithFallback({ src, alt, className }) {
  const [errored, setErrored] = useState(false);
  const fallback = '/assets/welcome.svg';

  return (
    <img
      src={errored ? fallback : src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
    />
  );
}

export default ImageWithFallback;
