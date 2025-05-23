// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export default `\
#version 300 es
#define SHADER_NAME raster-mesh-layer-fs

precision highp float;

uniform bool hasTexture;

uniform bool flatShading;
uniform float opacity;

in vec2 vTexCoord;
in vec3 cameraPosition;
in vec3 normals_commonspace;
in vec4 position_commonspace;
in vec4 vColor;

out vec4 fragColor;

void main(void) {
  geometry.uv = vTexCoord;
  vec4 image;
  DECKGL_CREATE_COLOR(image, vTexCoord);

  DECKGL_MUTATE_COLOR(image, vTexCoord);

  vec3 normal;
  if (flatShading) {

// This is necessary because
// headless.gl reports the extension as
// available but does not support it in
// the shader.
#ifdef DERIVATIVES_AVAILABLE
    normal = normalize(cross(dFdx(position_commonspace.xyz), dFdy(position_commonspace.xyz)));
#else
    normal = vec3(0.0, 0.0, 1.0);
#endif
  } else {
    normal = normals_commonspace;
  }

  vec3 lightColor = lighting_getLightColor(image.rgb, cameraPosition, position_commonspace.xyz, normal);
  fragColor = vec4(lightColor, opacity);

  DECKGL_FILTER_COLOR(fragColor, geometry);
}
`;
