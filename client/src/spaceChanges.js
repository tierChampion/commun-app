export function toPixelSpace(x, y, mapCorner, mapScale, screenDim) {
  var screenPercentX = (x - mapCorner[0]) * mapScale;
  var screenPercentY = (y - mapCorner[1]) * mapScale;

  return [screenPercentX * screenDim[0], screenPercentY * screenDim[1]];
}

export function toMapSpace(x, y, screenDim, mapCorner, mapScale) {
  var screenX = x / screenDim[0];
  var screenY = y / screenDim[1];

  // Send position in screen percentage
  return [screenX / mapScale + mapCorner[0], screenY / mapScale + mapCorner[1]];
}
