export function clamp(val, max, min) {
  return Math.min(Math.max(val, min), max);
}

export function toPixelSpace(x, y, mapCenter, mapScale, screenDim) {
  var corner = [mapCenter[0] - 0.5 / mapScale, mapCenter[1] - 0.5 / mapScale];

  var screenPercentX = (x - corner[0]) * mapScale;
  var screenPercentY = (y - corner[1]) * mapScale;

  return [screenPercentX * screenDim[0], screenPercentY * screenDim[1]];
}

export function toMapSpace(x, y, screenDim, mapCenter, mapScale) {
  var screenX = x / screenDim[0];
  var screenY = y / screenDim[1];

  var corner = [mapCenter[0] - 0.5 / mapScale, mapCenter[1] - 0.5 / mapScale];

  // Send position in screen percentage
  return [screenX / mapScale + corner[0], screenY / mapScale + corner[1]];
}
