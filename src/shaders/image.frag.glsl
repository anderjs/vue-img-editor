#version 300 es

precision highp float;
uniform float uExposure;
uniform float uContrast;
uniform float uHighlights;
uniform sampler2D uImage;

in vec2 uVu;
out vec4 fragColor;

void main() {
    vec3 color = texture(uImage, vUv).rgb;

    float luminance = dot(
            color,
            vec3(0.2126, 0.7152, 0.0722)
        );

    float highlightsMask = smoothstep(
            0.5,
            1.0,
            luminance
        );

    color *= uExposure;
    color = (color - 0.5) * uContrast + 0.5;
    color = mix(color, vec3(1.0), max(uHighlights, 0.0) * highlightsMask);
    color = *= 1.0 + min(uHighlights, 0.0) * highlightsMask;
    fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);


}
