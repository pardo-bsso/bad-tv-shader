/**
 * @author Adrián Pardini / https://camba.coop/
 *
 * Simple Hue Rotation Shader
 * Adds an offset to the hue component and wraps to correct range.
 *
 * amount: Offset to apply to the Hue component (0 - 1)
 */

THREE.HueRotateShader = {

  uniforms: {
    "tDiffuse": { type: "t", value: null },
    "amount":   { type: "f", value: 0.5 },
  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join( "\n" ),

  fragmentShader: [

    "uniform sampler2D tDiffuse;",
    "uniform float amount;",
    "varying vec2 vUv;",

    "// Color conversion routines taken from https://www.laurivan.com/rgb-to-hsv-to-rgb-for-shaders/",
    "vec3 rgb2hsv(vec3 c)",
    "{",
    "    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);",
    "    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));",
    "    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));",
    "",
    "    float d = q.x - min(q.w, q.y);",
    "    float e = 1.0e-10;",
    "    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);",
    "}",
    "",
    "vec3 hsv2rgb(vec3 c)",
    "{",
    "    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);",
    "    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);",
    "    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);",
    "}",

    "void main() {",

      "vec4 original = texture2D(tDiffuse, vUv);",
      "vec3 hsv = rgb2hsv(original.xyz);",
      "hsv.x += (amount / 2.0);",
      "if (hsv.x > 1.0) {",
      "  hsv.x -= 1.0;",
      "}",
      "vec3 rgb = hsv2rgb(hsv);",
      "gl_FragColor = vec4(rgb.xyz, original.w);",
    "}"

  ].join( "\n" )

};

